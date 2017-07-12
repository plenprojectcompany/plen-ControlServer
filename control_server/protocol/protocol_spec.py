# -*- coding: utf-8 -*-

'''
@file  protocol_spec.py
@brief Test script for protocol module.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


import unittest

from protocol.protocol import Protocol


class ProtocolTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from os.path import isfile
        from json import load

        if isfile('device_map.json'):
            with open('device_map.json', 'r') as fin:
                cls._device_map = load(fin)
                cls._protocol   = Protocol(cls._device_map)

        else:
            raise unittest.SkipTest('Loading "device_map.json" is failed!')


    def test_applyDiff(self):
        for device in self._device_map:
            with self.subTest('Device: {}'.format(device)):
                expected = '$AD{:02x}258'.format(self._device_map[device]).encode()
                actual   = self._protocol.applyDiff(device, 600)

                self.assertEqual(expected, actual)

                expected = '$AD{:02x}da8'.format(self._device_map[device]).encode()
                actual   = self._protocol.applyDiff(device, -600)

                self.assertEqual(expected, actual)


    def test_apply(self):
        for device in self._device_map:
            with self.subTest('Device: {}'.format(device)):
                expected = '$AN{:02x}258'.format(self._device_map[device]).encode()
                actual   = self._protocol.apply(device, 600)

                self.assertEqual(expected, actual)

                expected = '$AN{:02x}da8'.format(self._device_map[device]).encode()
                actual   = self._protocol.apply(device, -600)

                self.assertEqual(expected, actual)


    def test_getMotion(self):
        expected = b'<MO00'
        actual   = self._protocol.getMotion(0)

        self.assertEqual(expected, actual)

        expected = b'<MO59'
        actual   = self._protocol.getMotion(89)

        self.assertEqual(expected, actual)


    def test_playMotion(self):
        expected = b'$PM00'
        actual   = self._protocol.playMotion(0)

        self.assertEqual(expected, actual)

        expected = b'$PM59'
        actual   = self._protocol.playMotion(89)

        self.assertEqual(expected, actual)


    @unittest.skip('Work in progress...')
    def test_setMotionHeader(self):
        pass


    @unittest.skip('Work in progress...')
    def test_setMotionFrame(self):
        pass


    def test_pushCode(self):
        expected = b'#PU0000'
        actual   = self._protocol.pushCode(0, 0)

        self.assertEqual(expected, actual)

        expected = b'#PU00ff'
        actual   = self._protocol.pushCode(0, 255)

        self.assertEqual(expected, actual)

        expected = b'#PU5900'
        actual   = self._protocol.pushCode(89, 0)

        self.assertEqual(expected, actual)

        expected = b'#PU59ff'
        actual   = self._protocol.pushCode(89, 255)

        self.assertEqual(expected, actual)


    def test_setHome(self):
        for device in self._device_map:
            with self.subTest('Device: {}'.format(device)):
                expected = '>HO{:02x}258'.format(self._device_map[device]).encode()
                actual   = self._protocol.setHome(device, 600)

                self.assertEqual(expected, actual)

                expected = '>HO{:02x}da8'.format(self._device_map[device]).encode()
                actual   = self._protocol.setHome(device, -600)

                self.assertEqual(expected, actual)


    def test_setMin(self):
        for device in self._device_map:
            with self.subTest('Device: {}'.format(device)):
                expected = '>MI{:02x}258'.format(self._device_map[device]).encode()
                actual   = self._protocol.setMin(device, 600)

                self.assertEqual(expected, actual)

                expected = '>MI{:02x}da8'.format(self._device_map[device]).encode()
                actual   = self._protocol.setMin(device, -600)

                self.assertEqual(expected, actual)


    def test_setMax(self):
        for device in self._device_map:
            with self.subTest('Device: {}'.format(device)):
                expected = '>MA{:02x}258'.format(self._device_map[device]).encode()
                actual   = self._protocol.setMax(device, 600)

                self.assertEqual(expected, actual)

                expected = '>MA{:02x}da8'.format(self._device_map[device]).encode()
                actual   = self._protocol.setMax(device, -600)

                self.assertEqual(expected, actual)
