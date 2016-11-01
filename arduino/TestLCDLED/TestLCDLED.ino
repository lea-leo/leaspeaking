#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <Servo.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

// LES LED RVB
const int R=1; 
const int V=1; 
const int B=1;

// --- Déclaration des constantes des broches E/S numériques ---

const int ledRouge=3; // Constante pour la broche 3
const int ledVert=5; // Constante pour la broche 5
const int ledBleu=6; // Constante pour la broche 6

// LED ROSE

int led = 9;           // the PWM pin the LED is attached to
int brightness = 0;    // how bright the LED is
int fadeAmount = 5;    // how many points to fade the LED by

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

int RIGHT_ARM_HIGH = 100;
int RIGHT_ARM_LOW = 0;
int LEFT_ARM_HIGH = 0;
int LEFT_ARM_LOW = 100;
int HEAD_MIDDLE = 60;
int HEAD_RIGHT = 0;
int HEAD_LEFT = 120;



void setup()
{
  Serial.begin(9600);
 
  lcd.begin(); // initialize the lcd
  lcd.backlight();
  lcd.setCursor (0,0);  
  lcd.print("  Tweetez moi sur");
  lcd.setCursor (0,2);  
  lcd.print("   @devfest_lea");

   // declare pin 9 to be an output:
  pinMode(led, OUTPUT);// LED ROSE


// ------- Broches en sorties numériques -------  
 pinMode (ledVert,OUTPUT); // Broche ledVert configurée en sortie
 pinMode (ledRouge,OUTPUT); // Broche ledRouge configurée en sortie
 pinMode (ledBleu,OUTPUT); // Broche ledBleu configurée en sortie

 rightArm.attach(11);
 rightArm.write(LOW_POSITION);
 leftArm.attach(12);
 leftArm.write(LOW_POSITION);
 head.attach(10);
 head.write(LOW_POSITION);
 
}



void loop()
{
  moveArmsTogether();
   digitalWrite(ledBleu,LOW); // allume la couleur voulue
   delay(500); // pause
   digitalWrite(ledBleu,HIGH);
   digitalWrite(ledVert,LOW); // allume la couleur voulue
   delay(500); // pause
   digitalWrite(ledVert,HIGH);
   digitalWrite(ledRouge,LOW); // allume la couleur voulue
   delay(500); // pause
   digitalWrite(ledRouge,HIGH);

 
   
   ledRVBpwm(124, 88, 0);
   delay(500);
   ledRVBpwm(214, 193, 58);
   delay(500);
}

//---- fonction pour combiner couleurs ON/OFF ---- 

void ledRVB(int Rouge, int Vert, int Bleu) {

  //--- attention - avec une LED RGB anode commune : la LED s'allume sur niveau BAS !

 if (Rouge==1) digitalWrite(ledRouge,LOW); // allume couleur
 if (Rouge==0) digitalWrite(ledRouge,HIGH); // éteint couleur

 if (Vert==1) digitalWrite(ledVert,LOW); // allume couleur
 if (Vert==0) digitalWrite(ledVert,HIGH); // éteint couleur

 if (Bleu==1) digitalWrite(ledBleu,LOW); // allume couleur
 if (Bleu==0) digitalWrite(ledBleu,HIGH); // éteint couleur

}

//---- fonction pour variation progressive des couleurs ---- 

void ledRVBpwm(int pwmRouge, int pwmVert, int pwmBleu) { // reçoit valeur 0-255 par couleur

   //--- attention - avec une LED RGB anode commune : la LED s'allume sur niveau BAS !

 analogWrite(ledRouge, 255-pwmRouge); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
 analogWrite(ledVert, 255-pwmVert); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
 analogWrite(ledBleu, 255-pwmBleu); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
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


void moveArmsTogether() {
  //attachServo();
   moveHead();
  moveUpArmsTogether();
  moveDownArmsTogether();
  //detachServo();  
}

void moveHead() {
  //attachServo();
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
//  detachServo();
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



