# -*- coding: utf-8 -*-

'''
@file  router.py
@brief Provide routing methods.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company, and all authors.'
__license__   = 'The MIT License'


import logging
from bottle import (Bottle, request, response, abort, debug)
from empty_motion import MOTION


# Create module level instances.
# ==============================================================================
_LOGGER = logging.getLogger('plen-ControlServer').getChild(__name__)

_empty_motion = MOTION
_driver       = None

router = Bottle()
debug(True)


def enable_cors(fn):
    '''
    @brief Enable CORS (Cross Origin Resource Sharing) decorator.

    @param [in, out] fn Routing method

    @return Decorated *fn*
    '''

    def _enable_cors(*args, **kwargs):
        response.headers['Access-Control-Allow-Origin' ] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

        if request.method != 'OPTIONS':
            # Actual request; reply with the actual response.
            return fn(*args, **kwargs)

    return _enable_cors


@router.route('/v2/cmdstream')
def cmdstream():
    '''
    @brief Provide command-line stream on WebSocket.

    The resource is able to do commands below.
    - apply
    - applyDiff
    - setHome

    Usage is shown as below.
    @code
    var socket = new WebSocket('ws://localhost:17264/v2/cmdstream');

    socket.send('<METHOD_NAME>/<PARAM_0>/<PARAM_1>/...');
    @endcode

    @note
    Definition of WebSocket does not regulate cross origin resource sharing,
    so you may not use <b>enable_cors</b> decorator.
    '''

    wsock = request.environ.get('wsgi.websocket')

    if not wsock:
        _LOGGER.error('Expected WebSocket request!')

        abort(400, 'Expected WebSocket request.')

    if _driver.connect():
        while True:
            try:
                messages = wsock.receive().split('/')
                result   = getattr(_driver, messages[0])(messages[1:])

                wsock.send(str(result))

            except:
                _driver.disconnect()

                break
    else:
        _LOGGER.error('PLEN is not found!')

        abort(404, 'PLEN is not found.')


@router.route('/v2/motions/<SLOT:int>', method=['OPTIONS', 'GET'])
@enable_cors
def motion_get(SLOT):
    '''
    @brief Getter for a motion instance.

    @param [in] SLOT Slot number of a motion.
    '''

    response_json = {
        'resource': 'motions',
        'data': _driver.getMotion(SLOT)
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/motions/<SLOT:int>', method=['OPTIONS', 'DELETE'])
@enable_cors
def motion_delete(SLOT):
    '''
    @brief Deleter for a motion instance.

    @param [in] SLOT Slot number of a motion.
    '''

    _empty_motion['slot'] = SLOT

    response_json = {
        'resource': 'motions',
        'data': {
            'command': 'reset',
            'result': _driver.install(_empty_motion)
        }
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/motions/<SLOT:int>', method=['OPTIONS', 'PUT'])
@enable_cors
def motion_put(SLOT):
    '''
    @brief Creator for a motion instance.

    @param [in] SLOT Slot number of a motion.
    '''

    response_json = {
        'resource': 'motions',
        'data': {
            'command': 'install',
            'result': _driver.install(request.json)
        }
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/motions/<SLOT:int>/play', method=['OPTIONS', 'GET'])
@enable_cors
def motion_play(SLOT):
    '''
    @brief Play a motion.

    @param [in] SLOT Slot number of a motion.
    '''

    response_json = {
        'resource': 'motions',
        'data': {
            'command': 'play',
            'result': _driver.play(SLOT)
        }
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/motions/stop', method=['OPTIONS', 'GET'])
@enable_cors
def motion_stop():
    '''
    @brief Stop a motion.
    '''

    response_json = {
        'resource': 'motions',
        'data': {
            'command': 'stop',
            'result': _driver.stop()
        }
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/version', method=['OPTIONS', 'GET'])
@enable_cors
def version_get():
    '''
    @brief Getter for PLEN's version information.
    '''

    response_json = {
        'resource': 'version',
        'data': _driver.getVersionInformation()
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/metadata', method=['OPTIONS', 'GET'])
@enable_cors
def metadata_get():
    '''
    @brief Getter for the version information.
    '''

    response_json = {
        'resource': 'metadata',
        'data': {
            'api-version': 2,
            'require-firmware': '1.1.0~'
        }
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/connect', method=['OPTIONS', 'GET'])
@enable_cors
def connect():
    '''
    @brief Connect a driver.
    '''

    response_json = {
        'resource': 'driver',
        'data': {
            'command': 'connect',
            'result': _driver.connect()
        }
    }

    response.content_type = 'application/json'

    return response_json


@router.route('/v2/disconnect', method=['OPTIONS', 'GET'])
@enable_cors
def disconnect():
    '''
    @brief Disconnect a driver
    '''

    response_json = {
        'resource': 'driver',
        'data': {
            'command': 'disconnect',
            'result': _driver.disconnect()
        }
    }

    response.content_type = 'application/json'

    return response_json


def set_driver(driver):
    '''
    @brief Setter for data transfer driver.

    @param [in] driver Data transfer driver.
    '''

    from drivers.abstract import AbstractDriver

    if isinstance(driver, AbstractDriver):
        global _driver; _driver = driver


def server_worker(port=17264):
    '''
    @brief WSGI worker.

    @param [in] port port number.
    '''

    from gevent.pywsgi import WSGIServer
    from geventwebsocket.handler import WebSocketHandler

    wsgi = WSGIServer(('localhost', port), router, handler_class=WebSocketHandler)
    wsgi.serve_forever()


# Application entry point.
# ==============================================================================
if __name__ == '__main__':
    import os
    import sys

    sys.path.append(os.pardir)

    from drivers.null.core import NullDriver

    _driver = NullDriver()

    server_worker()