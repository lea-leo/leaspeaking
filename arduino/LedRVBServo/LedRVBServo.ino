// --- Programme Arduino --- 
// Trame de code générée par le générateur de code Arduino
// du site www.mon-club-elec.fr 

// Auteur du Programme : X. HINAULT - Tous droits réservés 
// Programme écrit le : 20/2/2012.

// ------- Licence du code de ce programme ----- 
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License,
//  or any later version.
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ////////////////////  PRESENTATION DU PROGRAMME //////////////////// 

// -------- Que fait ce programme ? ---------
 /* Ce programme teste simplement l'affichage des couleurs
sur une LED RVB 5mm à anode commune (+ commun)  

La RVB dispose de 4 broches : 
* une broche de 5V
* une broche de commande du ROUGE
* une broche de commande du VERT
* une broche de commande du BLEU

Chaque broche peut recevoir une impulsion PWM (0-255) pour doser l'intensité de chacune des couleurs.  
*/

// --- Fonctionnalités utilisées --- 


// -------- Circuit à réaliser --------- 

// Broche 3 : La broche Rouge de la LED RGB
// Broche 5 : La broche Vert de la LED RGB
// Broche 6 : La broche Bleu de la LED RGB

// /////////////////////////////// 1. Entête déclarative /////////////////////// 
// A ce niveau sont déclarées les librairies incluses, les constantes, les variables, les objets utiles...

// --- Déclaration des constantes ---

// --- Inclusion des librairies ---

// --- Déclaration des constantes utiles ---

const int R=1; 
const int V=1; 
const int B=1;

// --- Déclaration des constantes des broches E/S numériques ---

const int ledRouge=3; // Constante pour la broche 3
const int ledVert=5; // Constante pour la broche 5
const int ledBleu=6; // Constante pour la broche 6

#include <Servo.h>

Servo myservo;  // create servo object to control a servo
Servo myservo1;
Servo myservo2;
// twelve servo objects can be created on most boards

int pos = 180;
int LOW_POSITION =  90;
int HIGH_POSITION =  0;

// LED ROSE

int led = 9;           // the PWM pin the LED is attached to
int brightness = 0;    // how bright the LED is
int fadeAmount = 5;    // how many points to fade the LED by

// --- Déclaration des constantes des broches analogiques ---


//const int Voie[6]={0,1,2,3,4,5}; //declaration constante de broche analogique


// --- Déclaration des variables globales ---


// --- Déclaration des objets utiles pour les fonctionnalités utilisées ---


// ////////////////////////// 2. FONCTION SETUP = Code d'initialisation ////////////////////////// 
// La fonction setup() est exécutée en premier et 1 seule fois, au démarrage du programme

void setup()   { // debut de la fonction setup()

// --- ici instructions à exécuter 1 seule fois au démarrage du programme --- 

// ------- Initialisation fonctionnalités utilisées -------  

// declare pin 9 to be an output:
  pinMode(led, OUTPUT);// LED ROSE


// ------- Broches en sorties numériques -------  
 pinMode (ledVert,OUTPUT); // Broche ledVert configurée en sortie
 pinMode (ledRouge,OUTPUT); // Broche ledRouge configurée en sortie
 pinMode (ledBleu,OUTPUT); // Broche ledBleu configurée en sortie

// ------- Broches en entrées numériques -------  
Serial.begin(9600);
  myservo.attach(12);
  myservo.write(LOW_POSITION);
  myservo1.attach(11);
  myservo1.write(LOW_POSITION);
  myservo2.attach(10);
  myservo2.write(LOW_POSITION);


// ------- Activation si besoin du rappel au + (pullup) des broches en entrées numériques -------  

// ------- Initialisation des variables utilisées -------  

// ------- Codes d'initialisation utile -------  

} // fin de la fonction setup()
// ********************************************************************************

////////////////////////////////// 3. FONCTION LOOP = Boucle sans fin = coeur du programme //////////////////
// la fonction loop() s'exécute sans fin en boucle aussi longtemps que l'Arduino est sous tension

void loop(){ // debut de la fonction loop()

  // LED ROSE

digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(5000);              // wait for a second
  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
  //delay(5000);              // wait for a second


//--- attention - avec une LED RGB anode commune : la LED s'allume sur niveau BAS !

    for (pos = 20; pos <= 90; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      myservo1.write(pos);
      myservo2.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }
//---- vert ---
digitalWrite(ledVert,LOW); // allume la couleur voulue
delay(1000); // pause
digitalWrite(ledVert,HIGH); // éteint la couleur voulue
delay(1000); // pause

    for (pos = 90; pos >= 20; pos -= 1) { // goes from 180 degrees to 0 degrees
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      myservo1.write(pos);
      myservo2.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }
    
//---- rouge ---
digitalWrite(ledRouge,LOW); // allume la couleur voulue
delay(1000); // pause
digitalWrite(ledRouge,HIGH); // éteint la couleur voulue
delay(1000); // pause

    myservo.write(LOW_POSITION);
    myservo1.write(LOW_POSITION);
    myservo2.write(LOW_POSITION);
    delay(120);
    
//---- bleu ---
digitalWrite(ledBleu,LOW); // allume la couleur voulue
delay(1000); // pause
digitalWrite(ledBleu,HIGH); // éteint la couleur voulue
delay(1000); // pause



//----- variation de couleur

// variation de rouge
for (int i=0; i<=255; i++) { // défile valeur 0 à 255
  ledRVBpwm(i,0,0); // génère impulsion largeur voulue pour la couleur
  delay(10); //pause
}

//ledRVB(0,0,0); // éteint toutes les couleurs



}

// ////////////////////////// FONCTIONS DE GESTION DES INTERRUPTIONS //////////////////// 


// ////////////////////////// AUTRES FONCTIONS DU PROGRAMME //////////////////// 

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
// ////////////////////////// Fin du programme //////////////////// 

