#include <LiquidCrystal_I2C.h>
#include <Wire.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display


void setup()
{
  Serial.begin(9600);
 
  lcd.begin(); // initialize the lcd
  lcd.backlight();
  lcd.setCursor (0,0);  
  lcd.print("  Tweetez moi sur");
  lcd.setCursor (0,2);  
  lcd.print("   @devfest_lea");
}



void loop()
{
}




