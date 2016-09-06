# writeSerial.py
import time
import argparse
import string
import json
import serial
import json
import sys
#from pprint import pprint


class MyListener():
    ser = serial.Serial()
    ser.port = 'COM5'
    ser.baudrate = 9600
    ser.timeout = 2
    ser.setDTR(False)

    ser.open()
    print ("Python value sent: ")
    #bytes = str.encode(sys.argv[1].encode())
    #ser.write(bytes)
    print (sys.argv[1].encode())
    ser.write(sys.argv[1].encode())
    time.sleep(1)



    #ser = serial.Serial()
    #ser.port = 'COM5'
    #ser.baudrate = 9600
    #ser.timeout = 1
    #ser.setDTR(False)
    #ser.open()
    #time.sleep(4)
    #print ("Message from arduino: ")
    #msg = ser.read(ser.inWaiting())
    #while msg != "" :
    #    print("------ dans la boucle ------")
    #    msg = ser.read(ser.inWaiting())
    #    print (msg)

    #msg = ser.read(ser.inWaiting()) # read everything in the input buffer
    #print ("Message from arduino: ")
    #print (msg)
    #print ("Message from arduino: ")
    #print(ser.read(ser.inWaiting()))










