#include <LiquidCrystal_I2C.h>

#include <Wire.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display

#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display
#include <Servo.h>

Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards

int pos = 180;
int LOW_POSITION =  180;
int HIGH_POSITION =  0;

void setup()
{
  Serial.begin(9600);
  lcd.init(); // initialize the lcd
  lcd.backlight();
  lcd.print("En attente de tweets...");
 // lcd.print("Setup Arduino"); // Print a message to the LCD.
 //myservo.attach(9);
 // myservo.write(LOW_POSITION);

}

void loop()
{
  //if (Serial.available())  {
   /* delay(100);
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(Serial.readString());
    delay(2000); */
    Serial.write("1");
    
    
    /*for (pos = 20; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      delay(40);                       // waits 15ms for the servo to reach the position
    }
    for (pos = 180; pos >= 20; pos -= 1) { // goes from 180 degrees to 0 degrees
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      delay(40);                       // waits 15ms for the servo to reach the position
    }
    myservo.write(LOW_POSITION);
    delay(120);*/

    /*for (pos = 180; pos >= 20; pos -= 1) { // goes from 180 degrees to 0 degrees
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }
    delay(1000);
    for (pos = 20; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
      delay(20);                       // waits 15ms for the servo to reach the position
    }*/
    
  //}
}
