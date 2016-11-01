#include <Servo.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display
Servo head;
Servo rightArm;
Servo leftArm;
// twelve servo objects can be created on most boards

int HEAD_PIN = 12;

int pos = 180;
int HEAD_MIDDLE = 90;
int HEAD_RIGHT = 0;
int HEAD_LEFT = 180;


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


void setup()
{
  Serial.begin(9600);

  lcd.begin(); // initialize the lcd
  lcd.backlight();
  lcd.setCursor (0,0);  
  lcd.print("  Tweetez moi sur");
  lcd.setCursor (0,2);  
  lcd.print("   @devfest_lea");
  
  head.attach(10);
  rightArm.attach(11);
  leftArm.attach(12);

 for (pos = 90; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
      head.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
 }
 
 for (pos = 0; pos <= 100; pos += 1) { // goes from 0 degrees to 180 degrees
      rightArm.write(pos);
      leftArm.write(180-pos);
      delay(40);                       // waits 15ms for the servo to reach the position
 }
  delay(500);
  head.detach();
  rightArm.detach();
  leftArm.detach();

    // declare pin 9 to be an output:
  pinMode(led, OUTPUT);// LED ROSE


// ------- Broches en sorties numériques -------  
 pinMode (ledVert,OUTPUT); // Broche ledVert configurée en sortie
 pinMode (ledRouge,OUTPUT); // Broche ledRouge configurée en sortie
 pinMode (ledBleu,OUTPUT); // Broche ledBleu configurée en sortie

  delay(500);
  digitalWrite(ledBleu,LOW); // allume la couleur voulue
  delay(200); // pause
  digitalWrite(ledBleu,HIGH); // éteint la couleur voulue
  delay(200); // pause
 
  //moveHead();
}

void moveHead() {
  for (pos = 90; pos <= 180; pos += 1) {
    head.write(pos);
    delay(40);
  }
  
  for (pos = 180; pos >= 0; pos -= 1) {
    head.write(pos);
    delay(40);
  }
  for (pos = 0; pos <= 90; pos += 1) {
    head.write(pos);
    delay(40);
  }
  head.detach();
}

void loop()
{
//  delay(500);
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
