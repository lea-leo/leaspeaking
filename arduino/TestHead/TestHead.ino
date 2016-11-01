#include <Servo.h>

Servo head;
//Servo rightArm;
//Servo leftArm;

int HEAD_PIN = 7;

void setup()
{
  Serial.begin(9600);
  head.attach(7);
  //rightArm.attach(11);
  //leftArm.attach(12);
  //rightArm.write(0);
  //leftArm.write(120);
  head.write(40);
  delay(1000);
  head.write(90);
  delay(1000);
  head.write(140);
  //head.detach();
}


void loop()
{
   head.write(40);
  delay(1000);
  head.write(90);
  delay(1000);
  head.write(140);
}
