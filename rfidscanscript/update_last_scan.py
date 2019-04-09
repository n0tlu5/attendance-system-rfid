#!/usr/bin/env python

import RPi.GPIO as GPIO
import SimpleMFRC522
import requests
import json
import time

url = "http://10.151.36.153:3000/rfid/update/last"
headers = {'Content-type': 'application/json', 'Accept': 'text/plain', 'keep_alive':'false'}

reader = SimpleMFRC522.SimpleMFRC522()

while(1):
    try:
   	id, text = reader.read()
	data = {'cid': id}
	r = requests.post(url, data=json.dumps(data), headers=headers)
	print r.content
	print "sleep for 2s"
	time.sleep(2)
	print(id)

    finally:
	GPIO.cleanup()
