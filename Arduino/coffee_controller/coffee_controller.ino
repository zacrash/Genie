/* Coffee Controller Module */
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
BLEService coffeeService("19B10000-E8F2-537E-4F6C-D104768A1216");

// Establish custon 128-but charactersitic uuid
BLECharacteristic coffeeChar("5667f3b1-d6a2-4fb2-a917-4bee580a9c84", BLERead | BLENotify, 2);

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

  ble.setLocalName("CoffeeController");
  ble.setAdvertisedServiceUuid(coffeeService.uuid());
  ble.addAttribute(coffeeService);
  ble.addAttribute(coffeeChar);

  // Set BLEWritten callback function to make cofee
  ble.setEventHandler(BLEWritten, makeCoffee);

  ble.begin();

  Serial.println("Bluetooth device active, waiting for connection...");
}

void loop() {
  ble.poll();
}

void makeCoffee(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.println("Connected!");
  Serial.println();
  Serial.println("Turning motor to HIGH");
  Serial.println("Pouring your cofee :)");

  // Turn motor connections high
  analogWrite(ASpeed, 100);
  analogWrite(BSpeed, 100);
  digitalWrite(ADir, HIGH);
  digitalWrite(BDir, HIGH);
}
