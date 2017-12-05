#include <CurieBLE.h>

BLEPeripheral ble;
BLEService lightService("123456789");

BLECharacteristic lightChar("1234", BLERead | BLENotify, 2);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  ble.setLocalName("LightController");
  ble.setAdvertisedServiceUuid(lightService.uuid());
  ble.addAttribute(lightService);
  ble.addAttribute(lightChar);

  ble.begin();
  Serial.println("Bluetooth device active, waiting for connection...");
}

void loop() {
  // put your main code here, to run repeatedly:
  BLECentral central = ble.central();

  if (central) {
    Serial.println("Connected to central: ");
    Serial.println(central.address());
  }
}
