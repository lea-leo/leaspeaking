#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <Servo.h>
#include <ArduinoJson.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

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


// LES LED RVB
const int R=1; 
const int V=1; 
const int B=1;


const int ledRouge=3; // Constante pour la broche 3
const int ledVert=6; // Constante pour la broche 5
const int ledBleu=5; // Constante pour la broche 6

// LED ROSE

int led = 9;           // the PWM pin the LED is attached to
int brightness = 0;    // how bright the LED is
int fadeAmount = 5;    // how many points to fade the LED by



const String KUNG_FU_PANDA = "KUNG_FU_PANDA";
const String SHAOLIN_SOCCER = "SHAOLIN_SOCCER";
const String EXORCISTE = "EXORCISTE";


String motion = KUNG_FU_PANDA;
String tweet = "";
String rank = "";


/**
 * Initialisation
 */
void setup()
{
  Serial.begin(9600);

  // Initailisation du positionnement des servo
  attachServo();
  rightArm.write(RIGHT_ARM_LOW);
  leftArm.write(LEFT_ARM_LOW);
  head.write(HEAD_MIDDLE);
  detachServo();

  // Initialisation des LED
  pinMode(led, OUTPUT);// LED ROSE
  pinMode (ledVert,OUTPUT); // Broche ledVert configurée en sortie
  pinMode (ledRouge,OUTPUT); // Broche ledRouge configurée en sortie
  pinMode (ledBleu,OUTPUT); // Broche ledBleu configurée en sortie

  // Initialisation du LCD
  lcd.begin(); // initialize the lcd
  lcd.backlight();
  lcd.home();
  lcd.setCursor (0,1);  
  lcd.print("   Initialisation");
  lcd.setCursor (0,2);  
  lcd.print("     ..........");

  ledRVBpwm(255,0,234); // Violet OK
  //ledRVBpwm(255,228,0); // Orange KO
  //ledRVBpwm(0,255,0); // Vert OK
  //exorcisteHead();
  
  //analogWrite(ledRouge, 255);
  //digitalWrite(ledBleu, LOW);
  delay(1000);
  //ledRVBpwm(0,255,0);
  delay(1000);
  //ledRVBpwm(0,0,255);
  delay(1000);
}

/**
 * Boucle principale
 */
void loop()
{

  //digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
  //delay(1000);              // wait for a second
  //digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
  
  if (Serial.available())  {
    //delay(1000);
    lcd.begin();
    lcd.setCursor(0,0);
    
    //lcd.print(Serial.readString());
    parseMessage(Serial.readString());
    String message = tweet;
    int charcount = message.length();
    
    if (charcount <= 20) {
      
      lcd.setCursor (0,0);        
      lcd.print(message);
      
    } else if (charcount > 20 && charcount <= 40) {
  
      long remainder = 40 - message.length();
      String firstPart = message.substring(0,20);
      String secondPart = message.substring(20,40);
  
      //firstPart[20] = '\0';
      //secondPart[remainder] = '\0';
      
      lcd.setCursor (0,0);        // go to start of 2nd line
      lcd.print(firstPart);
      lcd.setCursor (0,2);        // go to start of 2nd line
      lcd.print(secondPart);
      
    } else if (charcount > 40 && charcount <= 60) {
      
      int remainder = 60 - message.length();
      
      String firstPart = message.substring(0,20);
      String secondPart = message.substring(20,40);
      String thirdPart = message.substring(40,60);

      //firstPart[20] = '\0';
      //secondPart[20] = '\0';
      //thirdPart[remainder] = '\0';
          
      lcd.setCursor (0,0);        // go to start of 2nd line
      lcd.print(firstPart);
      lcd.setCursor (0,1);        // go to start of 2nd line
      lcd.print(secondPart);
      lcd.setCursor (0,2);        // go to start of 2nd line
      lcd.print(thirdPart);
  
      
    } else if (charcount > 60) {
      
      //int remainder = 80 - message.length();
      
      String firstPart = message.substring(0,20);
      String secondPart = message.substring(20,40);
      String thirdPart = message.substring(40,60);
      String fourthPart = message.substring(60,80);
      fourthPart = fourthPart + "...";      

      /*firstPart[20] = '\0';
      secondPart[20] = '\0';
      thirdPart[20] = '\0';
      fourthPart[20] = '\0';*/
                
      lcd.setCursor (0,0);        // go to start of 2nd line
      lcd.print(firstPart);
      lcd.setCursor (0,1);        // go to start of 2nd line
      lcd.print(secondPart);
      lcd.setCursor (0,2);        // go to start of 2nd line
      lcd.print(thirdPart);
      lcd.setCursor (0,3);        // go to start of 2nd line
      lcd.print(fourthPart);
   }
   leaMove();
  }
  // Bug impossible de récupérer la chaîne par l'intermédiaire du python
  // Alors que le script readArduino marche nickel
  // l'ajout de boucle au sein du programme python ne change rien.
  //delay(2000);
  //Serial.write("DONE");

}

void leaMove() {
  initializeMoves();

  if (motion == KUNG_FU_PANDA) {
    ledRVBpwm(0, 255,0);
    delay(500);
    moveArmsAlternate();
    moveHeadYesNoSoft();
  } else if (motion == SHAOLIN_SOCCER) {
    ledRVBpwm(255, 0,0);
    delay(500);
    moveArmsTogether();
  } else if (motion == EXORCISTE) {
    ledRVBpwm(0, 255,0);
    exorcisteHead();
  }
  /*delay(500);
  digitalWrite(ledVert,LOW); // allume la couleur voulue
  delay(200); // pause
  digitalWrite(ledVert,HIGH); // éteint la couleur voulue
  delay(200); // pause
  
  moveArmsTogether();

  ledRVBpwm(124, 88,0);

  delay(500);
  initializeMoves();
  
  delay(500);
  digitalWrite(ledBleu,LOW); // allume la couleur voulue
  delay(200); // pause
  digitalWrite(ledBleu,HIGH); // éteint la couleur voulue
  delay(200); // pause

  delay(500);
  moveArmsAlternate();
*/
  initializeMoves();

}

/**
 * Affichage des LED
 */
void ledRVB(int Rouge, int Vert, int Bleu) {
  //--- attention - avec une LED RGB anode commune : la LED s'allume sur niveau BAS !
 if (Rouge==1) digitalWrite(ledRouge,LOW); // allume couleur
 if (Rouge==0) digitalWrite(ledRouge,HIGH); // éteint couleur

 if (Vert==1) digitalWrite(ledVert,LOW); // allume couleur
 if (Vert==0) digitalWrite(ledVert,HIGH); // éteint couleur

 if (Bleu==1) digitalWrite(ledBleu,LOW); // allume couleur
 if (Bleu==0) digitalWrite(ledBleu,HIGH); // éteint couleur
}

/**
 * Affichage nuancé des LED
 */
void ledRVBpwm(int pwmRouge, int pwmVert, int pwmBleu) { // reçoit valeur 0-255 par couleur
   //--- attention - avec une LED RGB anode commune : la LED s'allume sur niveau BAS !
 analogWrite(ledRouge, 255-pwmRouge); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
 analogWrite(ledVert, 255-pwmVert); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
 analogWrite(ledBleu, 255-pwmBleu); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
}

/**
 * Récupération des données contenues dans le message
 */
void parseMessage(String message) {
  // Memory pool for JSON object tree.
  StaticJsonBuffer<1000> jsonBuffer;

  // Root of the object tree.
  JsonObject& root = jsonBuffer.parseObject(message);

  // Test if parsing succeeds.
  if (!root.success()) {
    Serial.println("parseObject() failed");
  }
  
  // Fetch values.
  //
  // Most of the time, you can rely on the implicit casts.
  // In other case, you can do root["time"].as<long>();
  /*int motionNumber = root["motion"];
  Serial.println(motionNumber);
  if (motionNumber == 1) {
    Serial.println("je suis dans kung fu panda");
    motion =  KUNG_FU_PANDA;
  } else if (motionNumber == 2) {
    Serial.println("je suis dans shaolin soccer");
    motion =  SHAOLIN_SOCCER;
  }*/
  motion = root["motion"].asString();
  tweet = root["tweet"].asString();
  rank = root["rank"].asString();
}


/**
 * Partie Gestion des servomoteurs 
 */

void initializeMoves() {
  attachServo();
  rightArm.write(RIGHT_ARM_LOW);
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
  head.write(HEAD_RIGHT);
  delay(1000);
  head.write(HEAD_LEFT);
  delay(1000);
  head.write(HEAD_MIDDLE);
  detachServo();
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
 for (pos = RIGHT_ARM_LOW; pos <= RIGHT_ARM_HIGH; pos += 1) {
      rightArm.write(pos);
      leftArm.write(pos);
      delay(40);
    }  
}

void moveDownArmsAlternate() {
  for (pos = RIGHT_ARM_HIGH; pos >= RIGHT_ARM_LOW; pos -= 1) {
      rightArm.write(pos);
      leftArm.write(pos);
      delay(40);
  }  
}

/**
 * Bouge les bras de manière coordonnée
 */
void moveArmsTogether() {
  moveUpArmsTogether();
  moveDownArmsTogether();
  detachServo();  
}

void moveUpArmsTogether() {
  for (pos = RIGHT_ARM_LOW; pos <= RIGHT_ARM_HIGH; pos += 1) {
    rightArm.write(pos);
    leftArm.write(LEFT_ARM_LOW - pos);
    delay(40);
  }  
}

void moveDownArmsTogether() {
  for (pos = RIGHT_ARM_HIGH; pos >= RIGHT_ARM_LOW; pos -= 1) {
    rightArm.write(pos);
    leftArm.write(LEFT_ARM_LOW - pos);
    delay(40);
  }
}

/**
 * Bouge la tête de gauche à droite doucement
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
 * Easter Egg Exorciste
 */
void exorcisteHead() {
  attachServo();
  // Mouvement tête
  for (int i = 0; i <= 50; i += 1) {
    head.write(20);
    delay(50);
    head.write(60);
    delay(50);    
  }
  for (int i = 0; i <= 50; i += 1) {
    rightArm.write(RIGHT_ARM_HIGH);
    leftArm.write(LEFT_ARM_HIGH);
    delay(50);
    rightArm.write(RIGHT_ARM_HIGH - 10);
    leftArm.write(LEFT_ARM_HIGH + 10);
    delay(50);
  }
  detachServo();
}

