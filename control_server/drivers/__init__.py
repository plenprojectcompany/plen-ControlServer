# -*- coding: utf-8 -*-

'''
@file  __init__.py
@brief Provide data transfer drivers mapping.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


from drivers.null import NullDriver
from drivers.usb import USBDriver


DRIVER_MAP = {
    'null': NullDriver,
    'usb' : USBDriver
}