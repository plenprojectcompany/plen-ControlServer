# -*- coding: utf-8 -*-

'''
@file  protocol.py
@brief Provide PLEN's protocol converter.
'''

__author__    = 'Kazuyuki TAKASE'
__copyright__ = 'PLEN Project Company, and all authors.'
__license__   = 'The MIT License'


from ctypes import c_ushort


class Protocol(object):
    def __init__(self, device_map):
        self._DEVICE_MAP = device_map
        self._values     = [ 0 for _ in range(24) ]

    def applyDiff(self, device, value):
        return '$AD%02x%03x' % (self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF))

    def apply(self, device, value):
        return '$AN%02x%03x' % (self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF))

    def homePosition(self):
        return '$HP'

    def playMotion(self, slot):
        return '$PM%02x' % slot

    def stopMotion(self):
        return '$SM'

    def popCode(self):
        return '#PO'

    def pushCode(self, slot, loop_count):
        return '#PU%02x%02x' % (slot, loop_count)

    def resetInterpreter(self):
        return '#RI'

    def setHome(self, device, value):
        return '>HO%02x%03x' % (self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF))

    def setJointSettings(self):
        return '>JS'

    def setMax(self, device, value):
        return '>MA%02x%03x' % (self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF))

    def install(self, motion):
        motion['_frame_length'] = len(motion['frames'])

        cmd = self.setMotionHeader(motion)

        for index in range(len(motion['frames'])):
            motion['frames'][index]['_slot']  = motion['slot']
            motion['frames'][index]['_index'] = index

            cmd += self.setMotionFrame(motion['frames'][index])

        return str(cmd)

    def setMotionFrame(self, frame):
        cmd  = '>MF'
        cmd += '%02x' % frame['_slot']
        cmd += '%02x' % frame['_index']
        cmd += '%04x' % frame['transition_time_ms']

        for output in frame['outputs']:
            self._values[self._DEVICE_MAP[output['device']]] = c_ushort(output['value']).value

        cmd += ''.join(map(lambda v: '%04x' % v, self._values))

        return str(cmd)

    def setMotionHeader(self, header):
        cmd  = '>MH'
        cmd += '%02x' % header['slot']
        cmd += header['name'].ljust(20)[:20]

        # TODO: `codes`周辺の設定処理をどうするか？
        protocol_code = '000000'

        for code in header['codes']:
            if code['func'] == 'loop':
                protocol_code = '01%02x%02x' % tuple(code['args'][:2])

                break

            if code['func'] == 'jump':
                protocol_code = '02%02x00' % code['args'][0]

                break

        cmd += protocol_code
        cmd += '%02x' % header['_frame_length']

        return str(cmd)

    def setMin(self, device, value):
        return '>MI%02x%03x' % (self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF))

    def getJointSettings(self):
        return '<JS'

    def getMotion(self, slot):
        return '<MO%02x' % slot

    def getVersionInformation(self):
        return '<VI'