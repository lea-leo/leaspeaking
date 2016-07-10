#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,20,4 );

void setup()
{
  Serial.begin(9600);
  lcd.init(); // initialize the lcd
  lcd.backlight();
  lcd.print("Setup Arduino"); // Print a message to the LCD.
}

void loop()
{
  if (Serial.available())  {
    lcd.clear();
    lcd.print(Serial.readString()); 
  }
}
