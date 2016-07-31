#include <LiquidCrystal_I2C.h>

#include <Wire.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display

#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display
#include <Servo.h>

//Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards

int pos = 180;
int LOW_POSITION =  180;
int HIGH_POSITION =  0;

void setup()
{
  Serial.begin(9600);
  lcd.init(); // initialize the lcd
  lcd.backlight();
  lcd.print((char) 0x5C);
 // lcd.print("Setup Arduino"); // Print a message to the LCD.
  //myservo.attach(9);
  //myservo.write(LOW_POSITION);

}

void loop()
{
  if (Serial.available())  {
    delay(100);
    lcd.setCursor(0,0);
    lcd.print(Serial.readString()); 
    Serial.write("DONE");
  }

}
