/* Coffee Controller Module */

#include <CurieBLE.h>


const int motorPin = 13;

BLEPeripheral ble;
// Establish custom 128-bit service uuid
BLEService coffeeService("19B10000-E8F2-537E-4F6C-D104768A1216");

// Establish custon 128-but charactersitic uuid
BLECharacteristic coffeeChar("5667f3b1-d6a2-4fb2-a917-4bee580a9c84", BLERead | BLENotify);

void setup() {
  // Define BLE charactersitic and service
  Serial.begin(9600);
  pinMode(motorPin, OUTPUT);
  ble.setLocalName("CoffeeController");
  ble.setAdvertisedServiceUuid(coffeeService.uuid());
  ble.addAttribute(coffeeService);
  ble.addAttribute(coffeeChar);

  // Set BLEWritten callback function to make cofee
  coffeeChar.setEventHandler(BLEWritten, makeCoffee);

  // Init value to 0
  coffeeChar.setValue(0);

  ble.begin();
  
  Serial.println("Bluetooth device active, waiting for connection...");
}

void loop() {
   // Poll device
   ble.poll();
}

void makeCoffee(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print("Characteristic event!");

  if (coffeeChar.value() == 1) {
    Serial.println("Making Cofee");
    digitalWrite(motorPin, HIGH);
  }
  else {
    Serial.println("Stopping");
    digitalWrite(motorPin, LOW);
  }
}
