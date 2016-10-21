#include <Servo.h>

Servo myservo;  // create servo object to control a servo
Servo myservo1;
Servo myservo2;
// twelve servo objects can be created on most boards

int pos = 180;
int LOW_POSITION =  180;
int HIGH_POSITION =  0;

void setup()
{
  Serial.begin(9600);
  myservo.attach(9);
  myservo.write(LOW_POSITION);
  myservo1.attach(8);
  myservo1.write(LOW_POSITION);
  myservo2.attach(7);
  myservo2.write(LOW_POSITION);

}

void loop()
{
    for (pos = 20; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      myservo1.write(pos);
      myservo2.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }
    for (pos = 180; pos >= 20; pos -= 1) { // goes from 180 degrees to 0 degrees
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      myservo1.write(pos);
      myservo2.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }
    myservo.write(LOW_POSITION);
    myservo1.write(LOW_POSITION);
    myservo2.write(LOW_POSITION);
    delay(120);

    /*for (pos = 180; pos >= 20; pos -= 1) { // goes from 180 degrees to 0 degrees
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }
    delay(1000);
    for (pos = 20; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      delay(20);                       // waits 15ms for the servo to reach the position
    }*/
    
  //}
}
