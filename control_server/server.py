# -*- encoding:utf8 -*-

import sys, socket
from argparse import ArgumentParser
from flask import Flask, Response, json, make_response, request


server = Flask(__name__)
driver = None
DEVICE_MAP = 


# Make a response for json with padding.
# ==============================================================================
def jsonp(data, callback = "function"):
	return Response(
		"%s(%s)" % (callback, json.dumps(data)),
		mimetype = "text/javascript"
	)


# Web API for "Output" command.
# ==============================================================================
@server.route("/output/<DEVICE>/<VALUE>/")
def output(ID, ANGLE):
	data = {
		"command" : "Output",
		"DEVICE"  : DEVICE,
		"VALUE"   : VALUE,
		"result"  : None
	}
	callback = request.args.get("callback")
	
	data["result"] = driver.moveJoint(DEVICE, int(VALUE))

	if callback:
		return jsonp(data, callback)
	
	return jsonp(data)


# Web API for "Play" command.
# ==============================================================================
@server.route("/play/<SLOT>/")
def play(SLOT):
	data = {
		"command" : "Play",
		"SLOT"    : SLOT,
		"result"  : None
	}
	callback = request.args.get("callback")
	
	data["result"] = driver.play(int(SLOT))

	if callback:
		return jsonp(data, callback)
	
	return jsonp(data)


# Web API for "Install" command.
# ==============================================================================
@server.route("/install/", methods = ["OPTIONS"])
def return_xhr2_response_header__install():
	response = make_response()
	response.headers['Access-Control-Allow-Origin']  = '*'
	response.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"

	return response

@server.route("/install/", methods = ["POST"])
def install():
	data = {
		"command" : "Install",
		"result"  : None
	}

	data["result"] = driver.install(request.json)

	response = make_response(json.dumps(data, sort_keys = True, indent = 4))
	response.headers["Access-Control-Allow-Origin"] = "*"
	response.mimetype = "server/json"

	return response


# Web API for "Connect" command.
# ==============================================================================
@server.route("/connect/")
def connect():
	data = {
		"command" : "Connect",
		"result"  : None
	}
	callback = request.args.get("callback")
	
	data["result"] = driver.connect()

	if callback:
		return jsonp(data, callback)
	
	return jsonp(data)


# Web API for "Disconnect" command.
# ==============================================================================
@server.route("/disconnect/")
def disconnect():
	data = {
		"command" : "Disconnect",
		"result"  : None
	}
	callback = request.args.get("callback")

	data["result"] = driver.disconnect()

	if callback:
		return jsonp(data, callback)

	return jsonp(data)


# アプリケーション・エントリポイント
# ==============================================================================
def main(args):
	port = int(sys.argv[1]) if (sys.argv[1] != None) else 17264
	ip   = socket.gethostbyname(socket.gethostname())
	print '"PLEN - Control Server" is on "%s:%d".' % (ip, port)

	if sys.argv[2] != None:
		print 'Connect only "%s".' % (sys.argv[2])
	print '==============================================================================='

	server.debug = False
	server.run(port = arg_port)


if __name__ == "__main__":
	description = """
===============================================================================

/￣￣￣` 　|￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣|
|○　○| ＜　"PLEN - Control Server" is a HTTP server for controlling PLEN. |
+:----:+ 　|________________________________________________________________|
 ￣￣￣
===============================================================================
"""[1:-1]
	print description

	arg_parser = ArgumentParser()
	arg_parser.add_argument(
		'-p', '--port',
		dest    = 'port',
		type    = int,
		default = 17264,
		metavar = '<PORT NO.>',
		help    = 'default value is "17264".'
	)
	arg_parser.add_argument(
		'-d', '--driver',
		dest    = 'driver',
		choices = ('usb', 'bled112'),
		default = 'usb',
		metavar = '<DRIVER>',
		help    = 'please choose "usb" (default) or "bled112".'
	)
	arg_parser.add_argument(
		'--mac',
		dest    = 'mac',
		metavar = '<MAC ADDR.>',
		help    = "please set your PLEN's MAC address."
	)

	args = arg_parser.parse_args()
	main(args)