# -*- coding: utf-8 -*-

'''
@file  motion_schema.py
@brief Provide JSON validater for PLEN's motions.
'''

__author__    = 'Kazuma TAKAHARA'
__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


from abc import (ABCMeta, abstractmethod)


MOTION_SCHEMA = {
    "description": "Structure of a motion",
    "type": "object",
    "properties": {
        "slot": {
            "description": "Index that the motion is placed",
            "type": "integer",
            "minimum": 0,
            "maximum": 89
        },
        "name": {
            "description": "Name of the motion",
            "type": "string",
            "minLength": 0,
            "maxLength": 20
        },
        "@frame_length": {
            "description": "Length of the frames",
            "type": "integer",
            "minimum": 1,
            "maximum": 20,
            "optional": True
        },
        "codes": {
            "description": "Array of code",
            "type": "array",
            "items": {
                "description": "Structure of a code",
                "type": "object",
                "properties": {
                    "method": {
                        "description": "Method name you would like to call",
                        "type": "string"
                    },
                    "arguments": {
                        "description": "Arguments of the method",
                        "type": "array",
                        "items": {
                            "type": "any"
                        }
                    }
                }
            }
        },
        "frames": {
            "description": "Array of frame",
            "type": "array",
            "minItems": 1,
            "maxItems": 20,
            "items": {
                "description": "Structure of a frame",
                "type": "object",
                "properties": {
                    "@index": {
                        "description": "Index of the frame",
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 19,
                        "optional": True
                    },
                    "transition_time_ms": {
                        "description": "Time of transition to the frame",
                        "type": "integer",
                        "minimum": 32,
                        "maximum": 65535
                    },
                    "stop_flag": {
                        "description": "To select using stop flag or not (Working Draft)",
                        "type": "boolean",
                        "optional": True
                    },
                    "auto_balance": {
                        "description": "To select using auto balancer or not (Working Draft)",
                        "type": "boolean",
                        "optional": True
                    },
                    "outputs": {
                        "description": "Array of output",
                        "type": "array",
                        "items": {
                            "description": "Structure of a output",
                            "type": "object",
                            "properties": {
                                "device": {
                                    "description": "Name of the output device",
                                    "type": "string"
                                },
                                "value": {
                                    "description": "Value of the output",
                                    "type": "integer"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


class BadFormatException(Exception):
    pass


class _ValidaterBase(metaclass=ABCMeta):
    def __init__(self, schema):
        self.schema = schema

    @abstractmethod
    def validate_type(self, obj):
        pass

    @abstractmethod
    def validate_contains(self, obj):
        pass

    @abstractmethod
    def traversables(self, obj):
        pass


class _ObjectValidater(_ValidaterBase):
    def validate_type(self, obj):
        return isinstance(obj, dict)

    def validate_contains(self, obj):
        return all(
            (expected_key in obj) or child_schema.get('optional')
            for expected_key, child_schema in self.schema['properties'].items()
        )

    def traversables(self, obj):
        return (
            (child_schema, obj[expected_key])
            for expected_key, child_schema in self.schema['properties'].items()
            if expected_key in obj
        )


class _ArrayValidater(_ValidaterBase):
    def validate_type(self, obj):
        return isinstance(obj, list)

    def validate_contains(self, obj):
        len_obj = len(obj)
        min_len = self.schema.get('minItems', len_obj)
        max_len = self.schema.get('maxItems', len_obj)

        return min_len <= len_obj <= max_len

    def traversables(self, obj):
        child_schema = self.schema['items']

        return ((child_schema, item) for item in obj)


class _IntegerValidater(_ValidaterBase):
    def validate_type(self, obj):
        return isinstance(obj, int)

    def validate_contains(self, obj):
        min_obj = self.schema.get('minimum', obj)
        max_obj = self.schema.get('maximum', obj)

        return min_obj <= obj <= max_obj

    def traversables(self, obj):
        return ()


class _StringValidater(_ValidaterBase):
    def validate_type(self, obj):
        return (isinstance(obj, str) or isinstance(obj, unicode))

    def validate_contains(self, obj):
        len_obj = len(obj)
        min_len = self.schema.get('minLength', len_obj)
        max_len = self.schema.get('maxLength', len_obj)

        return min_len <= len_obj <= max_len

    def traversables(self, obj):
        return ()


class _BooleanValidater(_ValidaterBase):
    def validate_type(self, obj):
        return isinstance(obj, bool)

    def validate_contains(self, obj):
        return True

    def traversables(self, obj):
        return ()


class _AnyValidater(_ValidaterBase):
    def validate_type(self, obj):
        return True

    def validate_contains(self, obj):
        return True

    def traversables(self, obj):
        return ()


def _validater(schema):
    return {
        'object': _ObjectValidater,
        'array': _ArrayValidater,
        'integer': _IntegerValidater,
        'string': _StringValidater,
        'boolean': _BooleanValidater,
        'any': _AnyValidater,
    }[schema['type']](schema)


def _traverse(schema, obj):
    validater = _validater(schema)

    if not validater.validate_type(obj) or not validater.validate_contains(obj):
        from sys import stderr

        stderr.write('Bad format!:\n - schema = {}\n - json = {}\n'.format(schema, obj))

        raise BadFormatException()

    for traversable in validater.traversables(obj):
        _traverse(*traversable)


def validate(motion, schema=MOTION_SCHEMA):
    try:
        _traverse(schema, motion)

    except BadFormatException:
        return False

    return True
