// Lights controller
var noble = require('noble');

function hitLights(data) {
   // Declare Arduino UUID
   var serviceUUIDs = ["11111111-F1C3-1342-4C6R-C9134532AB16"];

   var characteristicUUIDs = ["11111111-d41f-1fcb-abcd-14be18ea3cc6"];

   console.log('Connecting to BLE Characteristic:', characteristicUUIDs[0]);
   console.log('Transmitting enable byte over BLE... Done');

   // Begin scan
   noble.on('stateChange', function(state) {
     if (state === 'poweredOn') {
       noble.startScanning(serviceUUIDs, false, (er) => {
          console.log("Error scanning:", er);
          return er;
       });
     } else {
       noble.stopScanning();
     }
   });
   // Connect and write a byte to trigger motor
   noble.on('discover', function(peripheral) {
      noble.stopScanning();
      peripheral.connect((error) => {
         console.log('Connected: ' + peripheral.uuid);

         peripheral.discoverServices(serviceUuids, (error, services) => {
            var service = services[0];
            console.log('Found service');

            service.discoverCharacteristics(characteristicUuids, function(error, characteristics) {
               var ledCharacteristic = characteristics[0];
               console.log('Found characteristics');

               var buf = new Buffer(1);

               setInterval(() => {
                  buf.writeUInt8((data));
                  coffeeChar.write(bufferToSend, false);
               }, 1000);

            });

         });
      });
   });
}

module.exports = {hitLights};
