#include <Firebase.h>
#include <FirebaseArduino.h>
#include <FirebaseCloudMessaging.h>
#include <FirebaseError.h>
#include <FirebaseHttpClient.h>
#include <FirebaseObject.h>
#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "sucre-devfest-ad6d9.firebaseio.com"
#define FIREBASE_AUTH "Lb8n1nzOHNtu0wZiSFhJ0z4GEsm4qV5kPOPFOS1W" //firebase token
#define WIFI_SSID "Flia. LOPEZ"
#define WIFI_PASSWORD "NZ48E36ZYb"

int ventana = 14;
int puerta = 12; 
void setup() {
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
 pinMode(ventana,OUTPUT); 
 pinMode(puerta,OUTPUT); 
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void loop() {
 
  int statusVentana = Firebase.getInt("habitacion/ventana");
  int statusPuerta = Firebase.getInt("habitacion/puerta");

if(statusVentana == 1){
  digitalWrite(ventana,HIGH);//LOW
}
if(statusVentana == 0){
  digitalWrite(ventana,LOW);//LOW
}
if(statusPuerta == 1){
  digitalWrite(puerta,HIGH);//LOW
}
if(statusPuerta == 0){
  digitalWrite(puerta,LOW);//LOW
}
    
 
}
