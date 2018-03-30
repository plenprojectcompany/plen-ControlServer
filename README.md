Control Server | PLEN Project Company Inc.
===============================================================================

A communication tool between HTTP and Serial for PLEN series robots.

## How to Use

1. Download latest version of the application from [here](https://github.com/plenprojectcompany/plen-ControlServer/releases).
2. Unzip the downloaded file.
3. Run the `ControlServer.exe` or `ControlServer.app`.
    - If you are an OSX user, you need to run the application by following steps.
    - Click on the application's icon with `ctrl` key.
    - Choose `open` from menu items. (Using this method, you can turn off security alert temporary.)
4. Connect your PLEN and a laptop using USB type micro B cable.
5. Start up any application to communicate with PLEN series robots. (s.a. [Motion Editor](http://plen.jp/playground/motion-editor/))

If you would like to use the application as a tuning up tool, Please [see also...](http://plen.jp/playground/wiki/tutorials/plen2/tune)

## Copyright (c) 2015,
- [Kazuyuki TAKASE](https://github.com/Guvalif)
- [Yugo KAJIWARA](https://github.com/musubi05)
- [Tsuyoshi TATSUKAWA](https://github.com/tatsukawa)
- [Kazuma TAKAHARA](https://github.com/kzm4269)
- [Tatsuroh SAKAGUCHI](https://github.com/Tacha-S)
- [PLEN Project Company Inc.](https://plen.jp)

## Build Environment
### OS
- Windows 8.1 Professional 64bit
- Windows 7 Home Premium SP1 64bit
- macOS High Sierra (10.13.3)

### ControlServer
- Python 2.7.9
- bottle 0.12.9
- gevent 1.1.0
- gevent-websocket 0.9.5
- pyserial 3.0.1
- py2exe 0.6.9
- py2app 0.14

### GUI
- Visual Studio Express 2013 for Web
- TypeScript Tools for Microsoft Visual Studio 2013 1.4.0.0
- Bootstrap v3.3.5
- AngularJS v1.4.7
- jQuery v2.2.4
- lodash 3.10.1

## License
This software is released under [the MIT License](https://opensource.org/licenses/mit-license.php).
