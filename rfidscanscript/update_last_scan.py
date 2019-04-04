#!/usr/bin/env python

import RPi.GPIO as GPIO
import SimpleMFRC522
import MySQLdb
import time

reader = SimpleMFRC522.SimpleMFRC522()
db = MySQLdb.connect("localhost","user","password","test" )
cursor = db.cursor()

while(1):
    try:
    	id, text = reader.read()
		sql = "UPDATE last_scan SET cid = '%s' WHERE id = 1" % (id)
		cursor.execute(sql)
		print "sleep for 2s"
		time.sleep(2)

    finally:
	GPIO.cleanup()