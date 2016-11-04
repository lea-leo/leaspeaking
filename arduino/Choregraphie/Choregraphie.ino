#include <Servo.h>

// LES SERVOMOTEURS
Servo rightArm;  // create servo object to control a servo
Servo leftArm;
Servo head;

int RIGHT_ARM_PIN = 11;
int LEFT_ARM_PIN = 12;
int HEAD_PIN = 10;

int pos = 180;
int LOW_POSITION =  180;
int HIGH_POSITION =  0;


int RIGHT_ARM_LOW = 0;
int RIGHT_ARM_MIDDLE = 40;
int RIGHT_ARM_HIGH = 80;

int LEFT_ARM_LOW = 80;
int LEFT_ARM_MIDDLE = 40;
int LEFT_ARM_HIGH = 0;

int HEAD_RIGHT = 0;
int HEAD_RIGHT_SOFT = 20;
int HEAD_MIDDLE = 40;
int HEAD_LEFT = 80;
int HEAD_LEFT_SOFT = 60;

void setup()
{
  Serial.begin(9600);
  attachServo();
  rightArm.write(RIGHT_ARM_LOW);
  leftArm.write(LEFT_ARM_LOW);
  head.write(HEAD_MIDDLE);

}

void loop()
{
  //moveArmsTogether();
  //moveHeadYesNo();
  detachServo();
  delay(10000);
}





/**
 * Partie Gestion des servomoteurs 
 */

void initializeMoves() {
  attachServo();
  rightArm.write(RIGHT_ARM_LOW);
  leftArm.write(LEFT_ARM_LOW);
  //head.write(HEAD_MIDDLE);  
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




/**
 * CHOREGRAPHIE
 */
 
/**
 * Bouge la tete de gauche à droite
 */
 
void moveHeadYesNo() {
  attachServo();
  moveHeadFromMiddleToLeft();
  moveHeadFromLeftToRight();
  moveHeadFromRightToMiddle();
  detachServo();
}

void moveHeadFromMiddleToLeft() {
  for (pos = HEAD_MIDDLE; pos <= HEAD_LEFT; pos += 1) {
    head.write(pos);
    delay(40);
  }  
}
void moveHeadFromLeftToRight() {
  for (pos = HEAD_LEFT; pos >= HEAD_RIGHT; pos -= 1) {
    head.write(pos);
    delay(40);
  } 
}

void moveHeadFromRightToMiddle() {
  for (pos = HEAD_RIGHT; pos <= HEAD_MIDDLE; pos += 1) {
    head.write(pos);
    delay(40);
  }   
}

/**
 * Bouge la tete de gauche à droite de manière douce
 */

void moveHeadYesNoSoft() {
  attachServo();
  moveHeadFromMiddleToLeftSoft();
  moveHeadFromLeftToRightSoft();
  moveHeadFromRightToMiddleSoft();
  detachServo();
}

void moveHeadFromMiddleToLeftSoft() {
  for (pos = HEAD_MIDDLE; pos <= HEAD_LEFT_SOFT; pos += 1) {
    head.write(pos);
    delay(40);
  }  
}

void moveHeadFromLeftToRightSoft() {
  for (pos = HEAD_LEFT_SOFT; pos >= HEAD_RIGHT_SOFT; pos -= 1) {
    head.write(pos);
    delay(40);
  } 
}

void moveHeadFromRightToMiddleSoft() {
  for (pos = HEAD_RIGHT_SOFT; pos <= HEAD_MIDDLE; pos += 1) {
    head.write(pos);
    delay(40);
  }   
}

/**
 * Bouge les bras en alternance
 */
 
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


/**
 * Bouge les bras en alternance de manière douce
 */
void moveArmsAlternateSoft() {
  attachServo();
  leftArm.write(LEFT_ARM_MIDDLE);
  moveUpArmsAlternateSoft();
  moveDownArmsAlternateSoft();
  detachServo();  
}

void moveUpArmsAlternateSoft() {
 for (pos = RIGHT_ARM_LOW; pos <= RIGHT_ARM_MIDDLE; pos += 1) { // goes from 0 degrees to 180 degrees
      rightArm.write(pos);
      leftArm.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }  
}

void moveDownArmsAlternateSoft() {
  for (pos = RIGHT_ARM_MIDDLE; pos >= RIGHT_ARM_LOW; pos -= 1) { // goes from 180 degrees to 0 degrees
      rightArm.write(pos);
      leftArm.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
  }  
}



/**
 * Bouge les bras ensemble
 */

void moveArmsTogether() {
  attachServo();
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

/**
 * Bouge les bras ensemble de manière douce
 */

void moveArmsTogetherSoft() {
  attachServo();
  moveUpArmsTogetherSoft();
  moveDownArmsTogetherSoft();
  detachServo();  
}

void moveUpArmsTogetherSoft() {
  for (pos = RIGHT_ARM_LOW; pos <= RIGHT_ARM_MIDDLE; pos += 1) {
    rightArm.write(pos);
    leftArm.write(LEFT_ARM_LOW - pos);
    delay(40);
  }  
}

void moveDownArmsTogetherSoft() {
  for (pos = RIGHT_ARM_MIDDLE; pos >= RIGHT_ARM_LOW; pos -= 1) {
    rightArm.write(pos);
    leftArm.write(LEFT_ARM_LOW - pos);
    delay(40);
  }
}
