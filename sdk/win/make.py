# -*- coding: utf-8 -*-

'''
@file  make.py
@brief A packaging script for py2exe.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company, and all authors.'
__license__   = 'The MIT License'


import os
from distutils.core import setup
import py2exe


options = {
    'compressed'   : True,
    'optimize'     : 2,
    'bundle_files' : 1,
    'excludes'     : [
        'gevent._socket3',
        '_ssl',
        'pyreadline',
        'difflib',
        'doctest',
        'optparse',
        'pickle'
    ],
    'dll_excludes' : ['msvcr71.dll']
}

setup(
    name        = 'Control Server',
    version     = os.environ.get('APP_VERSION'),
    description = 'A communication tool between HTTP and Serial for PLEN.',
    author      = 'PLEN Project Company',

    options = {
        'py2exe' : options
    },

    console = [
        {
            'script'         : 'main.py',
            'icon_resources' : [(1, './assets/app.ico')]
        }
    ],

    zipfile = None
)