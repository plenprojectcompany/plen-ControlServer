# -*- coding: utf-8 -*-

'''
@file  core.py
@brief Provide usb based data transfer driver.
'''

__author__    = 'Kazuyuki TAKASE'
__author__    = 'Yugo KAJIWARA'
__copyright__ = 'PLEN Project Company, and all authors.'
__license__   = 'The MIT License'


import serial
import serial.tools.list_ports
import time
import json
import logging
from drivers.abstract import AbstractDriver
from protocol.protocol import Protocol


# Create module level instances.
# =============================================================================
_LOGGER = logging.getLogger('plen-ControlServer').getChild(__name__)


class USBDriver(AbstractDriver):
    def __init__(self, device_map, options):
        self._serial   = None
        self._PROTOCOL = Protocol(device_map)


    def apply(self, device, value):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            self._serial.write(self._PROTOCOL.apply(device, int(value)))
            time.sleep(0.01)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def applyDiff(self, device, value):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            self._serial.write(self._PROTOCOL.applyDiff(device, int(value)))
            time.sleep(0.01)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def setHome(self, device, value):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            self._serial.write(self._PROTOCOL.setHome(device, int(value)))
            time.sleep(0.01)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def play(self, slot):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            self._serial.write(self._PROTOCOL.playMotion(slot))

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def stop(self):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            self._serial.write(self._PROTOCOL.stopMotion())

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def install(self, motion):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        CMD = self._PROTOCOL.install(motion)

        # Divide command length by payload size.
        BLOCK, SURPLUS = divmod(len(CMD), 64)

        try:
            for INDEX in range(BLOCK):
                self._serial.write(CMD[64 * INDEX: 64 * (INDEX + 1)])
                time.sleep(0.05)

            if SURPLUS:
                self._serial.write(CMD[-SURPLUS:])
                time.sleep(0.05)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def getMotion(self, slot):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return None

        try:
            self._serial.write(self._PROTOCOL.getMotion(slot))
            time.sleep(0.1)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return None

        motion = ''

        while self._serial.in_waiting > 0:
            motion += self._serial.read(self._serial.in_waiting)
            time.sleep(0.01)

        if len(motion):
            return json.loads(motion)

        return None


    def getVersionInformation(self):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return None

        try:
            self._serial.write(self._PROTOCOL.getVersionInformation())
            time.sleep(0.1)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return None

        version = ''

        while self._serial.in_waiting > 0:
            version += self._serial.read(self._serial.in_waiting)
            time.sleep(0.01)

        if len(version):
            return json.loads(version)

        return None


    def connect(self):
        for DEVICE in list(serial.tools.list_ports.comports()):
            if 'Arduino Micro' in DEVICE[1]:
                COM = DEVICE[0]

        if not 'COM' in locals():
            _LOGGER.error('PLEN is not found!')

            return False

        self.disconnect()

        self._serial = serial.Serial(port=COM, baudrate=2000000, timeout=1)
        self._serial.reset_input_buffer()
        self._serial.reset_output_buffer()

        return True


    def disconnect(self):
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        self._serial.close()
        self._serial = None

        return True