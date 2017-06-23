# -*- coding: utf-8 -*-

'''
@file  abstract.py
@brief Provide abstract data transfer driver.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


from abc import (ABCMeta, abstractmethod)
from typing import (Optional, Union)


class AbstractDriver(metaclass=ABCMeta):
    def __init__(self, device_map: dict, options: dict) -> None:
        pass

    @abstractmethod
    def apply(self, device: str, value: int) -> bool:
        pass

    @abstractmethod
    def applyDiff(self, device: str, value: int) -> bool:
        pass

    @abstractmethod
    def setHome(self, device: str, value: int) -> bool:
        pass

    @abstractmethod
    def play(self, slot: int) -> bool:
        pass

    @abstractmethod
    def stop(self) -> bool:
        pass

    @abstractmethod
    def push(self, slot: int, loop_count: int) -> bool:
        pass

    @abstractmethod
    def pop(self) -> bool:
        pass

    @abstractmethod
    def install(self, motion: dict) -> bool:
        pass

    @abstractmethod
    def resetJointSettings(self) -> bool:
        pass

    @abstractmethod
    def getMotion(self, slot: int) -> Optional[dict]:
        pass

    @abstractmethod
    def getVersionInformation(self) -> Optional[dict]:
        pass

    @abstractmethod
    def connect(self) -> bool:
        pass

    @abstractmethod
    def disconnect(self) -> bool:
        pass

    @abstractmethod
    def upload(self, code: str) -> Union[str, bool]:
        pass