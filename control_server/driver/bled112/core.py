# -*- encoding:utf8 -*-

import serial, serial.tools.list_ports, time
from ctypes import c_ushort
from bglib import BGLib


__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Ltd., and all authors.'
__license__   = 'The MIT License'


class Core:
	def __init__(self, device_map, mac = None):
		self._serial       = None
		self._bglib        = BGLib()
		self._bglib_result = False
		self._DEVICE_MAP   = device_map
		self._values     = [ 0 for x in range(24) ]

		if (mac != None):
			mac_addr = list(map(lambda h: int(h, 16), mac.split(':')))
			mac_addr.reverse()

		def ble_evt_gap_scan_response(sender, args):
			if mac != None:
				if args["sender"] == mac_addr:
					ble.send_command(self._serial, self._bglib.ble_cmd_gap_connect_direct(args["sender"], 0, 60, 76, 100, 0))
			else:
				ble.send_command(self._serial, self._bglib.ble_cmd_gap_connect_direct(args["sender"], 0, 60, 76, 100, 0))

		def ble_evt_connection_status(sender, args):
			if (args["flags"] == 0x05):
				self._bglib_result = True
			else:
				self._bglib_result = False

		self._bglib.ble_evt_gap_scan_response += ble_evt_gap_scan_response
		self._bglib.ble_evt_connection_status += ble_evt_connection_status

	def output(self, device, value):
		if self._serial == None:
			return False

		cmd = "$AD%02x%03x" % (self._DEVICE_MAP[device], c_ushort(value).value)

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd))))
		self._bglib.check_activity(self._serial, 1)
		self._bglib.check_activity(self._serial, 1)

		return True

	def play(self, slot):
		if self._serial == None:
			return False

		cmd = "$MP%02x" % slot

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd))))
		self._bglib.check_activity(self._serial, 1)
		self._bglib.check_activity(self._serial, 1)

		return True

	def stop(self):
		if self._serial == None:
			return False

		cmd = "$MS"

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd))))
		self._bglib.check_activity(self._serial, 1)
		self._bglib.check_activity(self._serial, 1)

		return True

	def install(self, json):
		if self._serial == None:
			return False

		# コマンドの指定
		cmd = "#IN"

		# スロット番号の指定
		cmd += "%02x" % (json["slot"])
		
		# モーション名の指定
		if len(json["name"]) < 20:
			cmd += json["name"].ljust(20)
		else:
			cmd += json["name"][:19]

		# 制御機能の指定
		if (len(json["codes"]) != 0):
			for code in json["codes"]:
				if (code["func"] == "loop"):
					cmd += "01%02x%02x" % (code["args"][0], code["args"][1])
					break

				if (code["func"] == "jump"):
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
		block   = len(cmd) // 20
		surplus = len(cmd) % 20

		for index in range(block):
			self._bglib.send_command(self._serial, self._bglib.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd[20 * index: 20 * (index + 1)]))))
			self._bglib.check_activity(self._serial, 1)
			self._bglib.check_activity(self._serial, 1)

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd[-surplus:]))))
		self._bglib.check_activity(self._serial, 1)
		self._bglib.check_activity(self._serial, 1)

		return True

	def connect():
		com = None

		for device in list(serial.tools.list_ports.comports()):
			if "Bluegiga" in device[1]:
				com = device[0]

		if com == None:
			return False

		if self._serial != None:
			self._serial.close()
			self._serial = None

		if self._serial == None:
			self._serial = serial.Serial(port = com, baudrate = 2000000, timeout = 1)
			self._serial.flushInput()
			self._serial.flushOutput()

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_connection_disconnect(0))
		self._bglib.check_activity(self._serial, 1)
		self._bglib.check_activity(self._serial, 1)

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_gap_set_mode(0, 0))
		self._bglib.check_activity(self._serial, 1)

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_gap_end_procedure())
		self._bglib.check_activity(self._serial, 1)

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_gap_discover(1))
		self._bglib.check_activity(self._serial, 1)

		self._bglib_result = False
		while (not self._bglib_result):
			self._bglib.check_activity(self._serial)
			time.sleep(0.01)

		return True

	def disconnect():
		if self._serial == None:
			return False

		self._bglib.send_command(self._serial, self._bglib.ble_cmd_connection_disconnect(0))
		self._bglib.check_activity(self._serial, 1)
		self._bglib.check_activity(self._serial, 1)
		self._bglib_result = False

		self._serial.close()
		self._serial = None

		return True