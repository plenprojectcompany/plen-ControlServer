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
        motion['@frame_length'] = len(motion['frames'])

        cmd = self.setMotionHeader(motion)

        for index in range(len(motion['frames'])):
            motion['frames'][index]['@slot']  = motion['slot']
            motion['frames'][index]['@index'] = index

            cmd += self.setMotionFrame(motion['frames'][index])

        return str(cmd)

    def setMotionFrame(self, frame):
        cmd  = '>MF'
        cmd += '%02x' % frame['@slot']
        cmd += '%02x' % frame['@index']
        cmd += '%04x' % frame['transition_time_ms']

        for output in frame['outputs']:
            self._values[self._DEVICE_MAP[output['device']]] = c_ushort(output['value']).value

        cmd += ''.join(map(lambda v: '%04x' % v, self._values))

        return str(cmd)

    def setMotionHeader(self, header):
        cmd  = '>MH'
        cmd += '%02x' % header['slot']
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
        cmd += '%02x' % header['@frame_length']

        return str(cmd)

    def setMin(self, device, value):
        return '>MI%02x%03x' % (self._DEVICE_MAP[device], (c_ushort(value).value & 0xFFF))

    def getJointSettings(self):
        return '<JS'

    def getMotion(self, slot):
        return '<MO%02x' % slot

    def getVersionInformation(self):
        return '<VI'


if __name__ == '__main__':
    import os
    from json import load
    from argparse import ArgumentParser

    arg_parser = ArgumentParser()
    arg_parser.add_argument(
        '-f', '--file',
        dest     = 'file',
        type     = file,
        required = True,
        metavar  = '<FILE>',
        help     = 'Please set any motion files you would like to convert.'
    )


    # Get device mapping.
    # -------------------------------------------------------------------------
    if os.path.isfile('device_map.json'):
        with open('device_map.json', 'r') as fin:
            DEVICE_MAP = load(fin)
    else:
        exit()


    # Convert a motion file to the protocol.
    # -------------------------------------------------------------------------
    args = arg_parser.parse_args()

    print(Protocol(DEVICE_MAP).install(load(args.file)))
