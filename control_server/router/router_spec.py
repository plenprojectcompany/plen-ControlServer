# -*- coding: utf-8 -*-

'''
@file  router_spec.py
@brief Test script for router module.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


import unittest
from json import loads
from multiprocessing import Process
from http.client import HTTPConnection

from websocket import WebSocket

from drivers.null import NullDriver
from router.router import (set_driver, server_worker)


def process_worker():
    set_driver(NullDriver(None, None))
    server_worker()


class RouterTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls._router_process = Process(target=process_worker)
        cls._router_process.start()


    @classmethod
    def tearDownClass(cls):
        cls._router_process.terminate()


    def setUp(self):
        self.http = HTTPConnection('localhost', 17264)


    def tearDown(self):
        self.http.close()


    def test_cmdstream(self):
        ws = WebSocket()
        ws.connect('ws://localhost:17264/v2/cmdstream')

        ws.send('apply/_0/_1')
        response = ws.recv()

        self.assertEqual(response, 'True')

        ws.send('getMotion/_0')
        response = ws.recv()

        self.assertEqual(response, '{}')

        ws.close()


    def test_motion_get(self):
        self.http.request('GET', '/v2/motions/0')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'motions',
                'data': {}
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_motion_delete(self):
        self.http.request('DELETE', '/v2/motions/0')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'motions',
                'data': {
                    'command': 'reset',
                    'result': True
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_motion_put(self):
        self.http.request('PUT', '/v2/motions/0', {})
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'motions',
                'data': {
                    'command': 'install',
                    'result': True
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_motion_play(self):
        self.http.request('GET', '/v2/motions/0/play')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'motions',
                'data': {
                    'command': 'play',
                    'result': True
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_motion_stop(self):
        self.http.request('GET', '/v2/motions/stop')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'motions',
                'data': {
                    'command': 'stop',
                    'result': True
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_version_get(self):
        self.http.request('GET', '/v2/version')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'version',
                'data': {}
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_metadata_get(self):
        self.http.request('GET', '/v2/metadata')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'metadata',
                'data': {
                    'api-version': 2,
                    'required-firmware': '1.4.1~'
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_connect(self):
        self.http.request('GET', '/v2/connect')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'driver',
                'data': {
                    'command': 'connect',
                    'result': True
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_disconnect(self):
        self.http.request('GET', '/v2/disconnect')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'driver',
                'data': {
                    'command': 'disconnect',
                    'result': True
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')


    def test_upload(self):
        self.http.request('PUT', '/v2/upload', 'SOURCECODE')
        response = self.http.getresponse()

        if response.status == 200:
            expected_json = {
                'resource': 'driver',
                'data': {
                    'command': 'upload',
                    'result': True
                }
            }

            actual_json = loads(response.read().decode())

            self.assertEqual(expected_json, actual_json)

        else:
            self.fail('Server connection is not available!')
