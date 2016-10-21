
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

// Arduino JSON library
// https://github.com/bblanchon/ArduinoJson
#include <ArduinoJson.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display


const String KUNG_FU_PANDA = "KungFuPanda";
const String SHAOLIN_SOCCER = "ShaolinSoccer";

String motion = KUNG_FU_PANDA;
String tweet = "";
String rank = "";


void setup()
{
  Serial.begin(9600);
  lcd.begin(); // initialize the lcd
  lcd.backlight();
  //lcd.print("Tweetez moi sur @devfest_lea");
  lcd.setCursor (0,0);  
  lcd.print("  Tweetez moi sur");
  lcd.setCursor (0,2);  
  lcd.print("   @devfest_lea");

  while (!Serial) {
    // wait serial port initialization
  }

  
}

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
  int motionNumber = root["motion"];
  Serial.println(motionNumber);
  if (motionNumber == 1) {
    Serial.println("je suis dans kung fu panda");
    motion =  KUNG_FU_PANDA;
  } else if (motionNumber == 2) {
    Serial.println("je suis dans shaolin soccer");
    motion =  SHAOLIN_SOCCER;
  }
  tweet = root["tweet"].asString();
  rank = root["rank"].asString();
}

//const String  message  = "Coucou le Monde";
//const String  message  = "Coucou le Monde et le reste";  //27
//const String  message  = "Coucou le Monde et le reste du monde avec tout ceux";
//const String  message  = "Coucou le Monde et le reste du monde si il fait beau et sans nuage pour un debu";
//const String  message  = "@devfest_lea - @sqli_leo pour franck qu'il voit comment cela fait un super cool";


void loop()
{
  if (Serial.available())  {
   // delay(1000);
    lcd.begin();
    lcd.setCursor(0,0);
    
    //lcd.print(Serial.readString());
    //String message = Serial.readString();
    parseMessage(Serial.readString());
    String message = tweet;
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
   //delay(30000);
  }
  // Bug impossible de récupérer la chaîne par l'intermédiaire du python
  // Alors que le script readArduino marche nickel
  // l'ajout de boucle au sein du programme python ne change rien.
  //delay(2000);
  //Serial.write("DONE");

}
