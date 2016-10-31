// Broche 3 : La broche Rouge de la LED RGB
// Broche 5 : La broche Vert de la LED RGB
// Broche 6 : La broche Bleu de la LED RGB

const int R=1; 
const int V=1; 
const int B=1;

const int ledRouge=3; // Constante pour la broche 3
const int ledVert=5; // Constante pour la broche 5
const int ledBleu=6; // Constante pour la broche 6


void setup()   { // debut de la fonction setup()
 pinMode (ledVert,OUTPUT); // Broche ledVert configurée en sortie
 pinMode (ledRouge,OUTPUT); // Broche ledRouge configurée en sortie
 pinMode (ledBleu,OUTPUT); // Broche ledBleu configurée en sortie
}

void loop(){ // debut de la fonction loop()
//---- vert ---
digitalWrite(ledVert,LOW); // allume la couleur voulue
delay(1000); // pause
digitalWrite(ledVert,HIGH); // éteint la couleur voulue
delay(1000); // pause

//---- rouge ---
digitalWrite(ledRouge,LOW); // allume la couleur voulue
delay(1000); // pause
digitalWrite(ledRouge,HIGH); // éteint la couleur voulue
delay(1000); // pause

//---- bleu ---
digitalWrite(ledBleu,LOW); // allume la couleur voulue
delay(1000); // pause
digitalWrite(ledBleu,HIGH); // éteint la couleur voulue
delay(1000); // pause

//----- test des couleurs au format RVB ---- 

//---- violet --- 
ledRVB(R,0,B); // allume R ouge et Bleu => violet
delay(1000); // pause
ledRVB(0,0,0); // éteint toutes les couleurs
delay(1000); // pause

//---- jaune --- 
ledRVB(R,V,0); // allume R ouge et Vert => jaune
delay(1000); // pause
ledRVB(0,0,0); // éteint toutes les couleurs
delay(1000); // pause

//---- bleu clair --- 
ledRVB(0,V,B); // allume Vert et Bleu => bleu clair
delay(1000); // pause
ledRVB(0,0,0); // éteint toutes les couleurs
delay(1000); // pause

//---- blanc --- 
ledRVB(R,V,B); // allume Rouge Vert et Bleu => blanc
delay(1000); // pause
ledRVB(0,0,0); // éteint toutes les couleurs
delay(1000); // pause


//----- variation de couleur

// variation de rouge
for (int i=0; i<=255; i++) { // défile valeur 0 à 255
  ledRVBpwm(i,0,0); // génère impulsion largeur voulue pour la couleur
  delay(10); //pause
}

//ledRVB(0,0,0); // éteint toutes les couleurs

// variation de bleu - rouge dégressif
for (int i=0; i<=255; i++) { // défile valeur 0 à 255
  ledRVBpwm(255-i,0,i); // génère impulsion largeur voulue pour la couleur
  delay(10); //pause
}

//ledRVB(0,0,0); // éteint toutes les couleurs

// variation de vert - bleu dégressif
for (int i=0; i<=255; i++) { // défile valeur 0 à 255
  ledRVBpwm(0,i,255-i); // génère impulsion largeur voulue pour la couleur
  delay(10); //pause
}

// variation de jaune 
for (int i=0; i<=255; i++) { // défile valeur 0 à 255
  ledRVBpwm(i,255,0); // génère impulsion largeur voulue pour la couleur
  delay(10); //pause
}

//etc... 

ledRVB(0,0,0); // éteint toutes les couleurs
delay(1000); 

//while(1); // stop loop

}

void ledRVB(int Rouge, int Vert, int Bleu) {

  //--- attention - avec une LED RGB anode commune : la LED s'allume sur niveau BAS !

 if (Rouge==1) digitalWrite(ledRouge,LOW); // allume couleur
 if (Rouge==0) digitalWrite(ledRouge,HIGH); // éteint couleur

 if (Vert==1) digitalWrite(ledVert,LOW); // allume couleur
 if (Vert==0) digitalWrite(ledVert,HIGH); // éteint couleur

 if (Bleu==1) digitalWrite(ledBleu,LOW); // allume couleur
 if (Bleu==0) digitalWrite(ledBleu,HIGH); // éteint couleur

}


void ledRVBpwm(int pwmRouge, int pwmVert, int pwmBleu) { // reçoit valeur 0-255 par couleur

   //--- attention - avec une LED RGB anode commune : la LED s'allume sur niveau BAS !

 analogWrite(ledRouge, 255-pwmRouge); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
 analogWrite(ledVert, 255-pwmVert); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut
 analogWrite(ledBleu, 255-pwmBleu); // impulsion largeur voulue sur la broche 0 = 0% et 255 = 100% haut


}
 
