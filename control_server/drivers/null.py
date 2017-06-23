# -*- coding: utf-8 -*-

'''
@file  core.py
@brief Provide null data transfer driver.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


import logging
from typing import (Optional, Union)

from drivers.abstract import AbstractDriver


# Create module level instances.
# =============================================================================
_LOGGER = logging.getLogger('plen-ControlServer').getChild(__name__)


class NullDriver(AbstractDriver):
    def __init__(self, device_map: dict, options: dict) -> None:
        pass

    def apply(self, device: str, value: int) -> bool:
        return True

    def applyDiff(self, device: str, value: int) -> bool:
        return True

    def setHome(self, device: str, value: int) -> bool:
        return True

    def play(self, slot: int) -> bool:
        return True

    def stop(self) -> bool:
        return True

    def push(self, slot: int, loop_count: int) -> bool:
        return True

    def pop(self) -> bool:
        return True

    def install(self, motion: dict) -> bool:
        return True

    def resetJointSettings(self) -> bool:
        return True

    def getMotion(self, slot: int) -> Optional[dict]:
        return {}

    def getVersionInformation(self) -> Optional[dict]:
        return {}

    def connect(self) -> bool:
        return True

    def disconnect(self) -> bool:
        return True

    def upload(self, code: str) -> Union[str, bool]:
        return True