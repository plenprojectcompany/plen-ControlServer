import lib.bglib
import serial, serial.tools.list_ports, time
from ctypes import *

# BGLIBの設定
# ==============================================================================
bglib_cmd_success = False

def onTimeout(sender, args):
	print "onTimeout"


def ble_evt_gap_scan_response(sender, args):
	print "### ble_evt_gap_scan_response"

	global ble
	global ser
	
	if (len(sys.argv) > 2):
		mac_addr = list(map(lambda h: int(h, 16), sys.argv[2].split(':')))
		mac_addr.reverse()

		if args["sender"] == mac_addr:
			ble.send_command(ser, ble.ble_cmd_gap_connect_direct(args["sender"], 0, 60, 76, 100, 0))
	else:
		ble.send_command(ser, ble.ble_cmd_gap_connect_direct(args["sender"], 0, 60, 76, 100, 0))


def ble_evt_connection_status(sender, args):
	print "### ble_evt_connection_status"

	global bglib_cmd_success
	if (args["flags"] == 0x05):
		print "+++ Success."
		bglib_cmd_success = True
	else:
		print "+++ Failure."
		bglib_cmd_success = False


ble = lib.bglib.BGLib()
ble.on_timeout += onTimeout
ble.ble_evt_gap_scan_response += ble_evt_gap_scan_response
ble.ble_evt_connection_status += ble_evt_connection_status

ser = None


# APIの定義
# ==============================================================================
DEVICE_MAP = # @todo *.jsonから読み込み

VALUE_MAP = [
	None,
	None,
	None,
	None,
	None,
	None,
	None,
	None,
	None,
	900,
	900,
	900,
	None,
	None,
	None,
	None,
	None,
	None,
	None,
	None,
	None,
	900,
	900,
	900
]


def jointMove(id, angle):
	global ser
	if ser == None:
		return False

	cmd = "#SD%02x%04x" % (id, c_ushort(angle).value)

	global ble
	ble.send_command(ser, ble.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd))))
	ble.check_activity(ser, 1)
	ble.check_activity(ser, 1)

	return True


def installMotion(json_data):
	global ser
	if ser == None:
		return False

	# コマンドの指定
	cmd = "#IN"
	# スロット番号の指定
	cmd += "%02x" % (json_data["slot"])
	# モーション名の指定
	if len(json_data["name"]) < 20:
		cmd += json_data["name"].ljust(20)
	else:
		cmd += json_data["name"][:19]
	# 制御機能の指定
	cmd += "000000"
	# フレーム数の指定
	cmd += "%02x" % (len(json_data["frames"]))
	# フレーム構成要素の指定
	for frame in json_data["frames"]:
		# 遷移時間の指定
		cmd += "%04x" % (frame["transition_time_ms"])

		for output in frame["outputs"]:
			VALUE_MAP[DEVICE_MAP[output["device"]]] = c_ushort(output["value"] * CWC_MAP[DEVICE_MAP[output["device"]]]).value
			# cmd += "%02x" % (DEVICE_MAP[output["device"]])
			# cmd += "%04x" % (c_ushort(output["value"]).value)

		for val in VALUE_MAP:
			cmd += "%04x" % val

	global ble
	block   = len(cmd) // 20
	surplus = len(cmd) - block * 20

	for index in range(block):
		ble.send_command(ser, ble.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd[20 * index: 20 * (index + 1)]))))
		ble.check_activity(ser, 1)
		ble.check_activity(ser, 1)

	ble.send_command(ser, ble.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd[-surplus:]))))
	ble.check_activity(ser, 1)
	ble.check_activity(ser, 1)

	return True


def playMotion(slot):
	global ser
	if ser == None:
		return False

	cmd = "$MP" + "%02x" % slot

	global ble
	ble.send_command(ser, ble.ble_cmd_attclient_attribute_write(0, 31, list(map(ord, cmd))))
	ble.check_activity(ser, 1)
	ble.check_activity(ser, 1)

	return True


def BLEConnect():
	com = None

	for device in list(serial.tools.list_ports.comports()):
		if "Bluegiga" in device[1]:
			com = device[0]

	if com == None:
		return False

	global ser
	if ser == None:
		ser = serial.Serial(port = com, baudrate = 115200, timeout = 1)
		ser.flushInput()
		ser.flushOutput()

	global ble
	ble.send_command(ser, ble.ble_cmd_connection_disconnect(0))
	ble.check_activity(ser, 1)
	ble.check_activity(ser, 1)

	ble.send_command(ser, ble.ble_cmd_gap_set_mode(0, 0))
	ble.check_activity(ser, 1)

	ble.send_command(ser, ble.ble_cmd_gap_end_procedure())
	ble.check_activity(ser, 1)

	ble.send_command(ser, ble.ble_cmd_gap_discover(1))
	ble.check_activity(ser, 1)

	global bglib_cmd_success
	bglib_cmd_success = False
	while (not bglib_cmd_success):
		ble.check_activity(ser)
		time.sleep(0.01)

	return True


def BLEDisconnect():
	global ser
	if ser == None:
		return False

	global ble
	ble.send_command(ser, ble.ble_cmd_connection_disconnect(0))
	ble.check_activity(ser, 1)
	ble.check_activity(ser, 1)

	ser.close()
	ser = None

	global bglib_cmd_success
	bglib_cmd_success = False

	return True
