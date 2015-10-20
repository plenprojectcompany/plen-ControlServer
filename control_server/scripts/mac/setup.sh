#!/bin/bash

curl -O http://peak.telecommunity.com/dist/ez_setup.py
python ez_setup.py
sudo easy_install pip
sudo pip install bottle
sudo pip install pyserial
sudo pip install gevent
sudo pip install gevent-websocket