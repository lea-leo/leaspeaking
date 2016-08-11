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
    #ser.setDTR(False)
    ser.open()
    time.sleep(2)
    print ("Message from arduino: ")
    print(ser.read(ser.inWaiting()))
    #print ser.readliine(ser.inWaiting()) # read everything in the input buffer
    
    #print (msg)








