#include <LiquidCrystal_I2C.h>
#include <Wire.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

Servo myservo;

int pos = 180;
int LOW_POSITION =  180;
int HIGH_POSITION =  0;

void setup()
{
  Serial.begin(9600);
  myservo.attach(9);
  myservo.write(LOW_POSITION);
  
  lcd.begin(); // initialize the lcd
  lcd.backlight();
  //lcd.print("Tweetez moi sur @devfest_lea");
  lcd.setCursor (0,0);  
  lcd.print("  Tweetez moi sur");
  lcd.setCursor (0,2);  
  lcd.print("   @devfest_lea");
}

//const String  message  = "Coucou le Monde";
//const String  message  = "Coucou le Monde et le reste";  //27
//const String  message  = "Coucou le Monde et le reste du monde avec tout ceux";
//const String  message  = "Coucou le Monde et le reste du monde si il fait beau et sans nuage pour un debu";
//const String  message  = "@devfest_lea - @sqli_leo pour franck qu'il voit comment cela fait un super cool";


void loop()
{
  if (Serial.available())  {
    delay(1000);
    lcd.begin();
    lcd.setCursor(0,0);
    
    //lcd.print(Serial.readString());
    String message = Serial.readString();
    int charcount = message.length();
    
    if (charcount <= 20) {
      
      lcd.setCursor (0,0);        
      lcd.print(message);
      
    } else if (charcount > 20 && charcount <= 40) {
  
      long remainder = 40 - message.length();
      String firstPart = message.substring(0,20);
      String secondPart = message.substring(20,39);
  
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
  
      
    } else if (charcount > 60 && charcount <= 80) {
      
      //int remainder = 80 - message.length();
      
      String firstPart = message.substring(0,20);
      String secondPart = message.substring(20,40);
      String thirdPart = message.substring(40,60);
      String fourthPart = message.substring(60,80);
      //fourthPart = fourthPart + "...";      

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
   //delay(30000);
  }
  // Bug impossible de récupérer la chaîne par l'intermédiaire du python
  // Alors que le script readArduino marche nickel
  // l'ajout de boucle au sein du programme python ne change rien.
  //delay(2000);
  //Serial.write("DONE");

}

function leaMove() {
      for (pos = 20; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      //myservo1.write(pos);
      //myservo2.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }
    for (pos = 180; pos >= 20; pos -= 1) { // goes from 180 degrees to 0 degrees
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      //myservo1.write(pos);
      //myservo2.write(pos);
      delay(40);                       // waits 15ms for the servo to reach the position
    }
    myservo.write(LOW_POSITION);
    //myservo1.write(LOW_POSITION);
    //myservo2.write(LOW_POSITION);
    delay(120);
}

