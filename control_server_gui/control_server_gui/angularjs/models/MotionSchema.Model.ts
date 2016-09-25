var motion_schema = {
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
            "optional": true
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
                        "description": "arguments of the method",
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
                        "optional": true
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
                        "optional": true
                    },
                    "auto_balance": {
                        "description": "To select using auto balancer or not (Working Draft)",
                        "type": "boolean",
                        "optional": true
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
};