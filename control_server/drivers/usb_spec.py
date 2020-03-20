# -*- coding: utf-8 -*-

'''
@file  usb_spec.py
@brief Test script for usb module.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


import unittest

from drivers.usb import USBDriver


class USBDriverTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from os.path import isfile
        from json import load


        if isfile('config.json'):
            with open('config.json', 'r') as fin:
                config = load(fin)

        else:
            raise unittest.SkipTest('Loading "config.json" is failed!')


        if isfile('device_map.json'):
            with open('device_map.json', 'r') as fin:
                device_map = load(fin)

        else:
            raise unittest.SkipTest('Loading "device_map.json" is failed!')


        cls._driver = USBDriver(device_map, config['driver']['options'])


    def setUp(self):
        self.assertTrue(self._driver.connect())


    def tearDown(self):
        self.assertTrue(self._driver.disconnect())


    def test_apply(self):
        pass


    def test_applyDiff(self):
        pass


    def test_setHome(self):
        pass


    def test_play(self):
        pass


    def test_stop(self):
        pass


    def test_push(self):
        pass


    def test_pop(self):
        pass


    def test_install(self):
        pass


    def test_resetJointSettings(self):
        pass


    def test_getMotion(self):
        pass


    def test_getVersionInformation(self):
        pass


    def test_upload(self):
        pass
