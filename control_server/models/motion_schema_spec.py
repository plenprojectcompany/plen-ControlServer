# -*- coding: utf-8 -*-

'''
@file  motion_schema_spec.py
@brief Test script for motion schema module.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


import unittest

from models.motion_schema import (validate, MOTION_SCHEMA)


class MotionSchemaTestCase(unittest.TestCase):
    @unittest.skip('Checking with eyes required. (Optional)')
    def test_showSchema(self):
        from json import dumps

        print(dumps(MOTION_SCHEMA, indent=4, separators=(',', ': ')))


    def test_validateObject(self):
        schema = {
            "type": "object",
            "properties": {
                "any": {
                    "type": "any"
                },
                "optional": {
                    "type": "any",
                    "optional": True
                }
            }
        }

        motion = { "any": None }

        self.assertTrue(validate(motion, schema))


    def test_validateArray(self):
        schema = {
            "type": "array",
            "items": {
                "type": "any"
            }
        }

        motion = [ None ]

        self.assertTrue(validate(motion, schema))


    def test_validateInteger(self):
        schema = {
            "type": "integer",
            "minimum": 0,
            "maximum": 89
        }

        self.assertTrue(validate(0, schema))
        self.assertTrue(validate(89, schema))

        self.assertFalse(validate(-1, schema))
        self.assertFalse(validate(90, schema))


    def test_validateString(self):
        schema = {
            "type": "string",
            "minLength": 0,
            "maxLength": 4
        }

        self.assertTrue(validate('PLEN', schema))

        self.assertFalse(validate('PLEN Project', schema))


    def test_validateBoolean(self):
        schema = {
            "type": "boolean"
        }

        self.assertTrue(validate(True, schema))
        self.assertTrue(validate(False, schema))


    def test_validateAny(self):
        schema = {
            "type": "any"
        }

        self.assertTrue(validate(None, schema))
        self.assertTrue(validate(True, schema))
        self.assertTrue(validate('', schema))
        self.assertTrue(validate(0, schema))
        self.assertTrue(validate([], schema))
        self.assertTrue(validate({}, schema))