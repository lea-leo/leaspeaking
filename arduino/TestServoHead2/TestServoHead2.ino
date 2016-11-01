#include <Servo.h>
#include <Wire.h>

Servo head;
int HEAD_PIN = 12;

int pos = 180;
int HEAD_MIDDLE = 90;
int HEAD_RIGHT = 0;
int HEAD_LEFT = 180;

void setup()
{
  Serial.begin(9600);
  head.attach(10);

 /*for (pos = 90; pos <= 120; pos += 1) { // goes from 0 degrees to 180 degrees
      head.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
 }
 delay(500);
 for (pos = 120; pos <= 90; pos += 1) { // goes from 0 degrees to 180 degrees
      head.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
 }*/
  delay(500);
  head.write(40);
  head.detach();
}

void loop()
{
}

