# -*- coding: utf-8 -*-

'''
This is a setup.py script generated by py2applet.

Usage:
    python setup.py py2app
'''

__author__    = 'Yugo KAJIWARA'
__copyright__ = 'PLEN Project Company, and all authors.'
__license__   = 'The MIT License'


from setuptools import setup


APP = ['./main.py']

OPTIONS = {
    'argv_emulation' : True,
    'packages'       : 'gevent',
    'excludes'       : [
        'gevent._socket3',
        '_ssl',
        'pyreadline',
        'difflib',
        'doctest',
        'optparse'
    ],
    'iconfile'       : './assets/app.icns'
}


setup(
    app     = APP,

    options = {
        'py2app': OPTIONS
    },

    setup_requires = ['py2app']
)