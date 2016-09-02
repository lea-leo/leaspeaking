#include <LiquidCrystal_I2C.h>

#include <Wire.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

void setup()
{
  Serial.begin(9600);
  lcd.init(); // initialize the lcd
  lcd.backlight();
  lcd.print("Tweeter moi sur @sqli_leo");
}

void loop()
{
  if (Serial.available())  {
    delay(100);
    lcd.setCursor(0,0);
    lcd.print(Serial.readString());
  }
  // Bug impossible de récupérer la chaîne par l'intermédiaire du python
  // Alors que le script readArduino marche nickel
  // l'ajout de boucle au sein du programme python ne change rien.
  //delay(2000);
  //Serial.write("DONE");

}
