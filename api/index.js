// Node server
const express = require('express');
const path = require('path');
const parser = require('./parse_commands');

const app = express();
const port = 3000;

// Routes
app.get('/', (request, response) => {
  response.send('Hello There');
});

app.get('/command', (request, response) => {

   // parse() expects a file path to audio: 
   // file type: .flac, bit resoultion: 16 bit, 
   // sampling rate: 16000 hertz, audio channel: mono
   // as an example: "resources/makeMeCoffee.flac"
   const getParse = parser.parse(request.body); 
   getParse.then(function(result){
      const command = result.action;
      switch (command) {
         case 'coffee':
         {
            return getCoffee((res, er) => {
               if (er) {
                  console.log("Error while getting coffee", er);
               }
               else {
                  console.log("Got Coffee", res);
                  response.send("Got Coffee!");
               }
            });
            break;
         }
         case 'lights':
         {
            return switchLights((res, er) => {
               if (er) {
                  console.log("Error while changing lights", er);
               }
               else {
                  console.log("Flipped lights", res);
                  response.send("Flipped lights!");
               }
            });
            break;
         }
         case 'search':
         {
            return gSearch((res, er) => {
               if (er) {
                  console.log("Error while google searching", er);
               }
               else {
                  console.log("Searching", res);
                  response.send("Searching!");
               }
            });
            break;
         }
         default:
            console.log("Unidentified command:", command);
            response.send("Could not understand command", command);
      }
   }).catch(err => {
      console.log("ERROR: ", err);
   })
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`Listening on ${port}`);
});
