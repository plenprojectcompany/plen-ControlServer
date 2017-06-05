# -*- coding: utf-8 -*-

'''
@file  abstract.py
@brief Provide abstract data transfer driver.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


from abc import (ABCMeta, abstractmethod)


class AbstractDriver(object):
    __mateclass__ = ABCMeta

    @abstractmethod
    def apply(self, device, value):
        pass

    @abstractmethod
    def applyDiff(self, device, value):
        pass

    @abstractmethod
    def setHome(self, device, value):
        pass

    @abstractmethod
    def play(self, slot):
        pass

    @abstractmethod
    def stop(self):
        pass

    @abstractmethod
    def push(self, slot, loop_count):
        pass

    @abstractmethod
    def pop(self):
        pass

    @abstractmethod
    def install(self, motion):
        pass

    @abstractmethod
    def resetJointSettings(self):
        pass

    @abstractmethod
    def getMotion(self, slot):
        pass

    @abstractmethod
    def getVersionInformation(self):
        pass

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def disconnect(self):
        pass

    @abstractmethod
    def upload(self, code):
        pass