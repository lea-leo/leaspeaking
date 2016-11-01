#include <Servo.h>

Servo rightArm;  // create servo object to control a servo
Servo leftArm;
Servo head;
// twelve servo objects can be created on most boards

int RIGHT_ARM_PIN = 11;
int LEFT_ARM_PIN = 12;
int HEAD_PIN = 10;

int pos = 180;
int RIGHT_ARM_HIGH = 100;
int RIGHT_ARM_LOW = 0;
int LEFT_ARM_HIGH = 0;
int LEFT_ARM_LOW = 100;
int HEAD_MIDDLE = 60;
int HEAD_RIGHT = 0;
int HEAD_LEFT = 120;


int LOW_POSITION =  180;
int HIGH_POSITION =  0;

void setup()
{
  Serial.begin(9600);
  rightArm.attach(11);
  leftArm.attach(12);
  rightArm.write(RIGHT_ARM_HIGH);
  leftArm.write(LEFT_ARM_LOW);
}

void initializeMoves() {
  attachServo();
  rightArm.write(RIGHT_ARM_HIGH);
  leftArm.write(LEFT_ARM_LOW);
  head.write(HEAD_MIDDLE);  
}

void attachServo() {
  if (!rightArm.attached())  {
    rightArm.attach(RIGHT_ARM_PIN);
  }
  if (!leftArm.attached())  {
    leftArm.attach(LEFT_ARM_PIN);
  }
  if (!head.attached())  {
    head.attach(HEAD_PIN);
  }
}

void detachServo() {
  if (rightArm.attached())  {
    rightArm.detach();
  }
  if (leftArm.attached())  {
    leftArm.detach();
  }
  if (head.attached())  {
    head.detach();
  }
}


void moveHead() {
  attachServo();
  for (pos = HEAD_MIDDLE; pos <= HEAD_RIGHT; pos += 1) {
    head.write(pos);
    delay(40);
  }
  for (pos = HEAD_RIGHT; pos >= HEAD_LEFT; pos -= 1) {
    head.write(pos);
    delay(40);
  }
  for (pos = HEAD_LEFT; pos <= HEAD_MIDDLE; pos += 1) {
    head.write(pos);
    delay(40);
  }
  detachServo();
}

void moveArmsAlternate() {
  attachServo();
  leftArm.write(LEFT_ARM_HIGH);
  moveUpArmsAlternate();
  moveDownArmsAlternate();
  detachServo();  
}

void moveUpArmsAlternate() {
 for (pos = RIGHT_ARM_LOW; pos <= RIGHT_ARM_HIGH; pos += 1) { // goes from 0 degrees to 180 degrees
      rightArm.write(pos);
      leftArm.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }  
}

void moveDownArmsAlternate() {
  for (pos = RIGHT_ARM_HIGH; pos >= RIGHT_ARM_LOW; pos -= 1) { // goes from 180 degrees to 0 degrees
      rightArm.write(pos);
      leftArm.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
  }  
}

void moveArmsTogether() {
  moveUpArmsTogether();
  moveDownArmsTogether();
  detachServo();  
}

void moveUpArmsTogether() {
  for (pos = RIGHT_ARM_LOW; pos <= RIGHT_ARM_HIGH; pos += 1) { // goes from 0 degrees to 180 degrees
    rightArm.write(pos);
    leftArm.write(LEFT_ARM_LOW - pos);
    delay(40);                       // waits 15ms for the servo to reach the position
  }  
}

void moveDownArmsTogether() {
  for (pos = RIGHT_ARM_HIGH; pos >= RIGHT_ARM_LOW; pos -= 1) { // goes from 180 degrees to 0 degrees
    rightArm.write(pos);
    leftArm.write(LEFT_ARM_LOW - pos);
    delay(40);                       // waits 15ms for the servo to reach the position
  }
}

void loop()
{
  /*initializeMoves();
  delay(500);
  moveHead();
  delay(500);
  //initializeMoves();
  delay(500);
  //moveArmsTogether();
  delay(500);
  //initializeMoves();
  delay(500);*/
  //moveArmsAlternate();

}
