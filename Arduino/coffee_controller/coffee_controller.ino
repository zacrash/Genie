/* Coffee Controller Module */

#include <CurieBLE.h>


const int motorPin = 13;

BLEPeripheral ble;
// Establish custom 128-bit service uuid
BLEService coffeeService("19B10000-E8F2-537E-4F6C-D104768A1216");

// Establish custon 128-but charactersitic uuid
BLECharacteristic coffeeChar("5667f3b1-d6a2-4fb2-a917-4bee580a9c84", BLERead | BLENotify, 2);

void setup() {
  Serial.begin(9600);
  while(!Serial);
  // Define BLE charactersitic and service
  pinMode(motorPin, OUTPUT);
  ble.setLocalName("CoffeeController");
  ble.setAdvertisedServiceUuid(coffeeService.uuid());
  ble.addAttribute(coffeeService);
  ble.addAttribute(coffeeChar);

  // Set BLEWritten callback function to make cofee
  ble.setEventHandler(BLEConnected, makeCoffee);
  
  ble.begin();

  Serial.println("Bluetooth device active, waiting for connection...");
}

void loop() {
  ble.poll();
//   // Check if the connection to the central is active or not
//  BLECentral central = ble.central();
//
//  if(central) {
//    Serial.print("Connected to central: ");
//    Serial.println(central.address());
//    digitalWrite(motorPin, HIGH);
//    
//    if(central.connected()) {
//      makeCoffee();
//    }
//    
//    Serial.print("Disconnected from central: ");
//    Serial.println(central.address());
//  }
}

void makeCoffee(BLECentral& central) {
  Serial.println("Connected!");
  Serial.println();
  Serial.println("Turning 'motorControllerPin' to HIGH");
  Serial.println("Pouring your cofee");
  digitalWrite(motorPin, HIGH);
  
}
