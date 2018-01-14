# -*- coding: utf-8 -*-

'''
@file  core.py
@brief Provide usb based data transfer driver.
'''

__author__    = 'Kazuyuki TAKASE'
__author__    = 'Yugo KAJIWARA'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


import os
import time
import json
import shutil
import logging
import subprocess
from platform import system
from base64 import b64encode
from typing import (Optional, Union)

import serial
from serial.tools.list_ports import comports

from drivers.abstract import AbstractDriver
from protocol.protocol import Protocol
from models.motion_schema import validate


# Create module level instances.
# =============================================================================
_LOGGER = logging.getLogger('plen-ControlServer').getChild(__name__)

_OS_TYPE = system()


class USBDriver(AbstractDriver):
    def __init__(self, device_map: dict, options: dict) -> None:
        self._serial: Optional[serial.Serial] = None

        self._PROTOCOL = Protocol(device_map)
        self._OPTIONS  = options


    @staticmethod
    def findDevice() -> Optional[str]:
        com = None

        # TODO: Will fix device finding method.
        for device in comports():
            if 'Arduino Micro' in device[1]:
                com = device[0]

        return com


    def apply(self, device: str, value: int) -> bool:
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


    def applyDiff(self, device: str, value: int) -> bool:
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


    def setHome(self, device: str, value: int) -> bool:
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


    def play(self, slot: int) -> bool:
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


    def stop(self) -> bool:
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


    def push(self, slot: int, loop_count: int) -> bool:
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            # TODO: Will fix loop_count adjustment.
            self._serial.write(self._PROTOCOL.pushCode(int(slot), int(loop_count) + 1))
            time.sleep(0.01)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def pop(self) -> bool:
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            self._serial.write(self._PROTOCOL.popCode())
            time.sleep(0.01)

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def install(self, motion: dict) -> bool:
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        if not validate(motion):
            _LOGGER.error('Motion schema is wrong!')

            return False

        CMD = self._PROTOCOL.install(motion)

        # Divide command length by payload size.
        PAYLOAD = 32
        BLOCK, SURPLUS = divmod(len(CMD), PAYLOAD)

        try:
            for INDEX in range(BLOCK):
                self._serial.write(CMD[PAYLOAD * INDEX: PAYLOAD * (INDEX + 1)])
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


    def resetJointSettings(self) -> bool:
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        try:
            self._serial.write(
                  self._PROTOCOL.setJointSettings()
                + self._PROTOCOL.homePosition()
            )

        except (
            serial.serialutil.SerialException,
            serial.serialutil.SerialTimeoutException
        ):
            _LOGGER.error('USB cable is disconnected!')

            self.disconnect()

            return False

        return True


    def getMotion(self, slot: int) -> Optional[dict]:
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

        motion = b''

        while self._serial.in_waiting > 0:
            motion += self._serial.read(self._serial.in_waiting)
            time.sleep(0.01)

        if len(motion):
            return json.loads(motion)

        return None


    def getVersionInformation(self) -> Optional[dict]:
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

        version = b''

        while self._serial.in_waiting > 0:
            version += self._serial.read(self._serial.in_waiting)
            time.sleep(0.01)

        if len(version):
            return json.loads(version)

        return None


    def connect(self) -> bool:
        self.disconnect()

        COM = self.findDevice()

        if COM is None:
            _LOGGER.error('PLEN is not found!')

            return False

        self._serial = serial.Serial(port=COM, baudrate=2000000, timeout=1)
        self._serial.reset_input_buffer()
        self._serial.reset_output_buffer()

        return True


    def disconnect(self) -> bool:
        if self._serial is None:
            _LOGGER.error('Serial connection is disabled!')

            return False

        self._serial.close()
        self._serial = None

        return True


    def upload(self, code: str) -> Union[str, bool]:
        self.disconnect()

        COM = self.findDevice()

        if COM is None:
            _LOGGER.error('PLEN is not found!')

            return False

        # shutil.rmtree('temp', ignore_errors=True)
        # os.mkdir('temp')

        if os.path.exists('./temp/temp.ino'):
            os.remove('./temp/temp.ino')

        with open('./temp/temp.ino', 'w') as fout:
            fout.write(code)

        proc = subprocess.Popen(
            [
                self._OPTIONS['compiler']['path'],
                '--port',   COM,
                '--board',  'arduino:avr:micro',
                '--upload', os.path.realpath('./temp/temp.ino')
            ],
            stdout = subprocess.PIPE,
            stderr = subprocess.STDOUT
        )

        proc.wait()


        # TODO: It only works at Japanese environment.
        if _OS_TYPE == 'Windows':
            return b64encode(proc.stdout.read().decode('shift-jis').encode()).decode()

        return b64encode(proc.stdout.read().encode()).decode()
