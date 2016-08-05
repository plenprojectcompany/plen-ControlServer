# -*- coding: utf-8 -*-

'''
@file  core.py
@brief Provide null data transfer driver.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company, and all authors.'
__license__   = 'The MIT License'


import logging
from drivers.abstract import AbstractDriver


# Create module level instances.
# =============================================================================
_LOGGER = logging.getLogger('plen-ControlServer').getChild(__name__)


class NullDriver(AbstractDriver):
    def __init__(self, device_map, options):
        pass

    def apply(self, device, value):
        return True

    def applyDiff(self, device, value):
        return True

    def setHome(self, device, value):
        return True

    def play(self, slot):
        return True

    def stop(self):
        return True

    def install(self, motion):
        return True

    def getMotion(self, slot):
        return {}

    def getVersionInformation(self):
        return {}

    def connect(self):
        return True

    def disconnect(self):
        return True

    def upload(self, code):
        return True