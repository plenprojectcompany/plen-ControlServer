# -*- coding: utf-8 -*-

'''
@file  protocol.py
@brief Provide PLEN's protocol converter.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company Inc, and all authors.'
__license__   = 'The MIT License'


from ctypes import c_ushort


class Protocol():
    def __init__(self, device_map: dict) -> None:
        self._DEVICE_MAP = device_map
        self._values     = [ 0 for _ in range(24) ]

    def applyDiff(self, device: str, value: int) -> bytes:
        return '$AD{:02x}{:03x}'.format(self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF)).encode()

    def apply(self, device: str, value: int) -> bytes:
        return '$AN{:02x}{:03x}'.format(self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF)).encode()

    def homePosition(self) -> bytes:
        return b'$HP'

    def playMotion(self, slot: int) -> bytes:
        return '$PM{:02x}'.format(slot).encode()

    def stopMotion(self) -> bytes:
        return b'$SM'

    def popCode(self) -> bytes:
        return b'#PO'

    def pushCode(self, slot: int, loop_count: int) -> bytes:
        return '#PU{:02x}{:02x}'.format(slot, loop_count).encode()

    def resetInterpreter(self) -> bytes:
        return b'#RI'

    def setHome(self, device: str, value: int) -> bytes:
        return '>HO{:02x}{:03x}'.format(self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF)).encode()

    def setJointSettings(self) -> bytes:
        return b'>JS'

    def setMax(self, device: str, value: int) -> bytes:
        return '>MA{:02x}{:03x}'.format(self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF)).encode()

    def install(self, motion: dict) -> bytes:
        motion['@frame_length'] = len(motion['frames'])

        cmd = self.setMotionHeader(motion)

        for index in range(len(motion['frames'])):
            motion['frames'][index]['@slot']  = motion['slot']
            motion['frames'][index]['@index'] = index

            cmd += self.setMotionFrame(motion['frames'][index])

        return cmd

    def setMotionFrame(self, frame: dict) -> bytes:
        cmd  = '>MF'
        cmd += '{:02x}'.format(frame['@slot'])
        cmd += '{:02x}'.format(frame['@index'])
        cmd += '{:04x}'.format(frame['transition_time_ms'])

        for output in frame['outputs']:
            self._values[self._DEVICE_MAP[output['device']]] = c_ushort(output['value']).value

        cmd += ''.join(map(lambda v: '{:04x}'.format(v), self._values))

        return cmd.encode()

    def setMotionHeader(self, header: dict) -> bytes:
        cmd  = '>MH'
        cmd += '{:02x}'.format(header['slot'])
        cmd += header['name'].ljust(20)[:20]

        protocol_codes = [
            '0000000', # For loop method
            '000',     # For jump method
            '0'        # For extra methods
        ]

        for code in header['codes']:
            if code['method'] == 'loop':
                protocol_codes[0] = '1{:02x}{:02x}{:02x}'.format(*(code['arguments'][:3]))

            if code['method'] == 'jump':
                protocol_codes[1] = '1{:02x}'.format(code['arguments'][0])

        cmd += ''.join(protocol_codes)
        cmd += '{:02x}'.format(header['@frame_length'])

        return cmd.encode()

    def setMin(self, device: str, value: int) -> bytes:
        return '>MI{:02x}{:03x}'.format(self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF)).encode()

    def getJointSettings(self) -> bytes:
        return b'<JS'

    def getMotion(self, slot: int) -> bytes:
        return '<MO{:02x}'.format(slot).encode()

    def getVersionInformation(self) -> bytes:
        return b'<VI'
