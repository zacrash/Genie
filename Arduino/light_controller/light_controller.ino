#include <CurieBLE.h>


const int motorPin = 13;

BLEPeripheral ble;
// Establish custom 128-bit service uuid
BLEService lightsService("11111111-F1C3-1342-4C6R-C9134532AB16");

// Establish custon 128-but charactersitic uuid
BLECharacteristic lightsChar("11111111-d41f-1fcb-abcd-14be18ea3cc6", BLERead | BLENotify, 2);

void setup() {
  Serial.begin(9600);
  while(!Serial);
  // Define BLE charactersitic and service
  pinMode(motorPin, OUTPUT);
  ble.setLocalName("LightsController");
  ble.setAdvertisedServiceUuid(lightsService.uuid());
  ble.addAttribute(lightsService);
  ble.addAttribute(lightsChar);

  // Set BLEWritten callback function to make cofee
  ble.setEventHandler(BLEConnected, flipLights);
  
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

void flipLights(BLECentral& central) {
  Serial.println("Connected!");
  Serial.println();
  Serial.println("Turning 'motorControllerPin' to HIGH");
  Serial.println("Turned off Lights");
  digitalWrite(motorPin, HIGH);
  
}
