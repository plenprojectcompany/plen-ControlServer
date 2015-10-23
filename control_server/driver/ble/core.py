# -*- coding: utf-8 -*-

import multiprocessing as proc
from threading import Timer
from ctypes import c_ushort
import objc
from PyObjCTools import AppHelper

objc.loadBundle("CoreBluetooth", globals(),
                bundle_path=objc.pathForFramework(u'/System/Library/Frameworks/CoreBluetooth.framework'))

__author__ = 'Yugo KAJIWARA'
__copyright__ = 'PLEN Project Company Ltd., and all authors.'
__license__ = 'The MIT License'

(WAIT,
 CONNECT,
 DISCONNECT,
 WRITE) = range(0, 4)


# HTTPServer-BLE通信部 接続部（sub processで実行）
class Core:
	_TIMEOUT = 2

	def __init__(self, device_map, mac=''):
		self._DEVICE_MAP = device_map
		self._values = [0 for x in range(24)]
		# BLE通信用プロセス作成
		connection = proc.Pipe()
		self._pipe = connection[0]
		self._commprocess = CommProcess(connection[1], mac=mac)
		self._httpprocess = None
		self._isconnected = False

	def run(self, http_process, host='localhost', port=17264):
		# HTTP Server (bottle) をサブプロセスで起動
		self._httpprocess = proc.Process(target=self.httpprocess_run, args=(http_process, host, port))
		self._httpprocess.start()
		# BLE通信部（AppHelperによる）をメインプロセスで起動（メソッド呼び出し後帰ってこない）
		self._commprocess.start()

	def httpprocess_run(self, process_method, host, port):
		# HTTP Server起動
		process_method(host=host, port=port)

	def output(self, device, value):
		if not self._isconnected:
			return False
		cmd = "$AD%02x%03x" % (self._DEVICE_MAP[device], c_ushort(value).value)
		# cmd write
		return self.send(cmd.encode())

	def play(self, slot):
		if not self._isconnected:
			return False
		cmd = "$PM%02x" % slot
		# cmd write
		return self.send(cmd.encode())

	def stop(self):
		if not self._isconnected:
			return False
		cmd = "$SM"
		# cmd write
		return self.send(cmd.encode())

	def install(self, json):
		if not self._isconnected:
			return False

		# コマンドの指定
		cmd = ">IN"

		# スロット番号の指定
		cmd += "%02x" % (json["slot"])

		# モーション名の指定
		if len(json["name"]) < 20:
			cmd += json["name"].ljust(20)
		else:
			cmd += json["name"][:19]

		# 制御機能の指定
		if len(json["codes"]) != 0:
			for code in json["codes"]:
				if code["func"] == "loop":
					cmd += "01%02x%02x" % (code["args"][0], code["args"][1])
					break

				if code["func"] == "jump":
					cmd += "02%02x00" % (code["args"][0])
					break
		else:
			cmd += "000000"

		# フレーム数の指定
		cmd += "%02x" % (len(json["frames"]))

		# フレーム構成要素の指定
		for frame in json["frames"]:
			# 遷移時間の指定
			cmd += "%04x" % (frame["transition_time_ms"])

			for output in frame["outputs"]:
				self._values[self._DEVICE_MAP[output["device"]]] = c_ushort(output["value"]).value

			for value in self._values:
				cmd += "%04x" % value

		# Divide command length by ble-payload size.
		block = len(cmd) // 20
		surplus = len(cmd) % 20

		for index in range(block):
			# send data and recieve send-result
			if self.send(bytearray(map(ord, cmd[20 * index: 20 * (index + 1)]))) is False:
				return False
			print 'packet written : %2d / %d' % (index + 1, block + 1)
		# send data and recieve send-result
		if self.send(bytearray(map(ord, cmd[-surplus:]))) is False:
			return False
		print 'packet written : %2d / %d' % (block + 1, block + 1)
		return True

	def connect(self):
		# connect request
		result = self.send(CONNECT)
		self._isconnected = result
		return result

	def disconnect(self):
		if not self._isconnected:
			return True
		# disconnect request
		result = self.send(DISCONNECT)
		self._isconnected = not result
		return result

	def send(self, data):
		# data send request
		self._pipe.send(data)
		# wait send-result
		try:
			result = self._pipe.recv()
		except:
			return False
		# return result
		return result


# BLE通信部（main processにて実行）
class CommProcess():
	def __init__(self, pipe, timeout=4, mac=''):
		self.isconnected = False
		self.isbusy = False
		self._pipe = pipe
		self._state = WAIT
		# BLE関係のインスタンス作成
		self._ble_delegate = BLEDelegate(self.timeout_reset, mac)
		self._manager = CBCentralManager.alloc()
		self._manager.initWithDelegate_queue_options_(self._ble_delegate, None, None)
		# Timeout用タイマ作成
		self._timeout_sec = timeout
		self._timer = None

	def _timeout(self, msg):
		if not self.isbusy:
			return
		self.isbusy = False
		self._ble_delegate.timeout()
		print "[", msg, "] TIMEOUT"
		# send ERROR message
		self._pipe.send(False)

	def timeout_reset(self):
		if self._timer is None:
			return
		args = self._timer.args
		self._timer.cancel()
		self._timer = Timer(self._timeout_sec, self._timeout, args=args)
		self._timer.start()

	def start(self):
		AppHelper.callLater(0.1, self._loop)
		AppHelper.runConsoleEventLoop()

	def _loop(self):
		request = WAIT
		if not self.isbusy and self._pipe.poll():
			# Coreからのメッセージ取得
			try:
				request = self._pipe.recv()
			except:
				pass
			if request == CONNECT:
				self.isbusy = True
				self._state = CONNECT
				self._timer = Timer(self._timeout_sec, self._timeout, args=["CONNECT"])
				self._timer.start()
				self._ble_delegate.bleConnect(self.callback)
			elif request == DISCONNECT:
				self.isbusy = True
				self._state = DISCONNECT
				self._timer = Timer(self._timeout_sec, self._timeout, args=["DISCONNECT"])
				self._timer.start()
				self._ble_delegate.bleDisconnect(self.callback)
			else:
				self.isbusy = True
				self._state = WRITE
				self._timer = Timer(self._timeout_sec, self._timeout, args=["WRITE"])
				self._timer.start()
				self._ble_delegate.send(request, self.callback)
		AppHelper.callLater(0.1, self._loop)

	def callback(self, result):
		if not self.isbusy:
			return
		self.isbusy = False
		# stop timeout-timer
		if self._timer is not None:
			self._timer.cancel()
		if result:
			if self._state == CONNECT:
				self.isconnected = True
			elif self._state == DISCONNECT:
				self.isconnected = False
		# send send-result
		self._pipe.send(result)
		self._state = WAIT


# BLE操作(pyObjcによるCoreBluetooth Framework)
class BLEDelegate(object):
	D_INFO_SERVICE = CBUUID.UUIDWithString_(u'180A')
	BT_ADDR_CHARACTERISTIC = CBUUID.UUIDWithString_(u'2A25')
	PLEN_SERVICE = CBUUID.UUIDWithString_(u'E1F40469-CFE1-43C1-838D-DDBC9DAFDDE6')
	PLEN_TX_CHARACTERISTIC = CBUUID.UUIDWithString_(u'F90E9CFE-7E05-44A5-9D75-F13644D6F645')

	def __init__(self, timeout_reset, mac=''):
		self.isble_available = False
		self._isbusy = False
		self._isconnected = False
		self._manager = None
		self._peripheral = None
		self._p_service = None
		self._d_service = None
		self._tx = None
		self._addr = None
		self._callback = None
		self._mac = mac
		self._exclude_peri_list = []
		self._timeout_reset = timeout_reset

	def timeout(self):
		if not self._isconnected:
			self._manager.stopScan()
			if self._peripheral is not None:
				self._manager.cancelPeripheralConnection_(self._peripheral)

	'''
	[Connect Process]
	1. scan peripherals
	2. connect a peripheral and search services
	(mac-address filter off)
	3. connect the PLEN_Control_Service and search the PLEN_TX_Characteristic
	4. finish!!
	(mac-address filter on)
	3. connect the Device_Information_Service and search the Serial_Number_Characteristic
	(if the serialNumber is not mac-address)
	4. append exclude-list and re-search another peripheral(back to 1.)
	(or else)
	4. connect the PLEN_Control_Service and search the PLEN_TX_Characteristic
	5. finish!!
	'''
	# PLEN Connect
	def bleConnect(self, callback=None):
		if not self.isble_available:
			if callback is not None:
				callback(False)
			return

		if self._isconnected:
			self._manager.cancelPeripheralConnection_(self._peripheral)
			self._peripheral = None
		self._exclude_peri_list = []
		# scan peripherals
		self._manager.scanForPeripheralsWithServices_options_([BLEDelegate.PLEN_SERVICE], None)
		self._callback = callback

	# PLEN Disconnect
	def bleDisconnect(self, callback=None):
		if not self.isble_available:
			if callback is not None:
				callback(False)
			return

		if self._manager is not None and self._isconnected:
			self._manager.stopScan()
			self._manager.cancelPeripheralConnection_(self._peripheral)
		self._peripheral = None
		self._isconnected = False
		if callback is not None:
			callback(True)

	# Send with Request the Write Response
	def send(self, byte, callback=None):
		if not self.isble_available:
			if callback is not None:
				callback(False)
			return
		self._callback = callback
		byte = NSData.dataWithBytes_length_(byte, len(byte))
		self._peripheral.writeValue_forCharacteristic_type_(byte, self._tx, 0)

	# Bluetooth State Update
	def centralManagerDidUpdateState_(self, manager):
		self._manager = manager
		# state : 5 -> CBCentralManagerState.PoweredOn
		if manager.state() == 5:
			self.isble_available = True
		else:
			self.isble_available = False

	# Peripherals Discovered
	def centralManager_didDiscoverPeripheral_advertisementData_RSSI_(self, manager, peripheral, data, rssi):
		if peripheral in self._exclude_peri_list:
			return
		# Connect this peripheral
		self._peripheral = peripheral
		self._manager.stopScan()
		manager.connectPeripheral_options_(peripheral, None)

	# The Peripheral Connected
	def centralManager_didConnectPeripheral_(self, manager, peripheral):
		print repr(peripheral)
		self._peripheral.setDelegate_(self)
		self._peripheral.discoverServices_([BLEDelegate.D_INFO_SERVICE, BLEDelegate.PLEN_SERVICE])

	# Connect Error
	def centralManager_didFailToConnectPeripheral_error_(self, manager, peripheral, error):
		if error is not None:
			print repr(error)
		if self._callback is not None:
			self._callback(False)

	# Disconnected
	def centralManager_didDisconnectPeripheral_error_(self, manager, peripheral, error):
		if error is not None:
			print repr(error)

	# Services Discovered
	def peripheral_didDiscoverServices_(self, peripheral, services):
		for service in peripheral.services():
			if service.UUID() == BLEDelegate.PLEN_SERVICE:
				self._p_service = service
				# searching characteristics (mac-address filter off. PLEN-TX-Characteristic-directly.)
				if self._mac == '':
					self._peripheral.discoverCharacteristics_forService_([BLEDelegate.PLEN_TX_CHARACTERISTIC], service)
					return
			elif service.UUID() == BLEDelegate.D_INFO_SERVICE:
				self._d_service = service
		# searching characteristics (mac-address filter on)
		self._peripheral.discoverCharacteristics_forService_([BLEDelegate.BT_ADDR_CHARACTERISTIC], self._d_service)

	# Characteristics Discovered
	def peripheral_didDiscoverCharacteristicsForService_error_(self, peripheral, service, error):
		if error is not None:
			print repr(error)
		# BT_ADDR Check
		if service.characteristics()[0].UUID() == BLEDelegate.BT_ADDR_CHARACTERISTIC:
			self._addr = service.characteristics()[0]
			self._peripheral.readValueForCharacteristic_(self._addr)
		# PLEN TX Characteristic Found. -> Finish!!
		if service.characteristics()[0].UUID() == BLEDelegate.PLEN_TX_CHARACTERISTIC:
			print("This perhipheral is PLEN.")
			self._tx = service.characteristics()[0]
			self._isbusy = False
			self._isconnected = True
			if self._callback is not None:
				self._callback(self._isconnected)

	# Value for Characteristic Recieved (BT_ADDR-recieve only)
	def peripheral_didUpdateValueForCharacteristic_error_(self, peripheral, characteristic, error):
		print "BT ADDR :", repr(characteristic.value().bytes().tobytes())
		if self._mac == str(characteristic.value().bytes().tobytes()):
			# This peripheral is the peripheral you want to connect to.
			# Searching characteristics (PLEN TX Characteristic)
			self._peripheral.discoverCharacteristics_forService_([BLEDelegate.PLEN_TX_CHARACTERISTIC], self._p_service)
		else:
			# This peripheral isn't the peripheral you want to connect to.
			# Append Exclude Peripheral List and Re-Searching Another Peripheral
			print "re-search..."
			self._timeout_reset()
			self._manager.cancelPeripheralConnection_(self._peripheral)
			self._exclude_peri_list.append(self._peripheral)
			self._peripheral = None
			self._manager.scanForPeripheralsWithServices_options_([BLEDelegate.PLEN_SERVICE], None)

	# Write Response Recieved
	def peripheral_didWriteValueForCharacteristic_error_(self, peripheral, characteristic, error):
		if error is not None:
			print repr(error)
		if self._callback is not None:
			self._callback(True if error is None else False)