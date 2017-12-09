/* Lights Controller Module */
#include <CurieBLE.h>

// Motor pins
#define ASpeed 3
#define BSpeed 11
#define ABrake 9
#define BBrake 8
#define ADir 12
#define BDir 13

BLEPeripheral ble;

// Establish custom 128-bit service uuid
BLEService lightService("11111111-F1C3-1342-4C6R-C9134532AB16");

// Establish custon 128-but charactersitic uuid
BLECharacteristic lightChar("11111111-d41f-1fcb-abcd-14be18ea3cc6", BLERead | BLENotify, 2);

void setup() {
  Serial.begin(9600);
  // Wait for serial to initialize
  while(!Serial);
  // Define BLE charactersitic and service
  pinMode(12, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(13, OUTPUT);
  pinMode(8, OUTPUT);
  digitalWrite(ABrake, LOW);
  digitalWrite(BBrake, LOW);

  ble.setLocalName("LightsController");
  ble.setAdvertisedServiceUuid(lightService.uuid());
  ble.addAttribute(lightService);
  ble.addAttribute(lightChar);

  // Set BLEWritten callback function to make cofee
  ble.setEventHandler(BLEWritten, flipLights);

  ble.begin();

  Serial.println("Bluetooth device active, waiting for connection...");
}

void loop() {
  ble.poll();
}

void flipLights(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.println("Connected!");
  Serial.println();
  Serial.println("Turning motor to HIGH");
  Serial.println("Lights have been turned off :)");

  // Turn motor connections high
  analogWrite(ASpeed, 100);
  analogWrite(BSpeed, 100);
  digitalWrite(ADir, HIGH);
  digitalWrite(BDir, HIGH);
}
