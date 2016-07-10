# writeSerial.py
import time
import argparse
import string
import json
import serial
import json
import sys
from pprint import pprint


class MyListener():
    ser = serial.Serial()
    ser.port = 'COM5'
    ser.baudrate = 9600
    ser.timeout = 1
    ser.setDTR(False)
    ser.open()
    ser.write(sys.argv[1].encode())
    time.sleep(1)








