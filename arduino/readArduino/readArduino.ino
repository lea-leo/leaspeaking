void setup()
{
  Serial.begin(9600);
}

void loop()
{
  //if (Serial.available())  {
    delay(2000);
    Serial.write("DONE");
  //}

}
