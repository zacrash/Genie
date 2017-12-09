// Node server
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')

const parser = require('./parse_commands');
const coffeeController = require('./coffee_controller');
const lightController = require('./light_controller');
const googleSearcher = require('./google_searcher');


const app = express();
const port = process.env.PORT || 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Routes
app.get('/', (request, response) => {
  response.send('Welcome to Genie');
});
app.post('/command', (request, response) => {
   // Parse incoming command
   const getParse = parser.parse(request.body.command);
   //console.log("getParse:", getParse);

   getParse.then(function (result){
      // Transcript of voice command
      const command = result.text;
      console.log("Command:", command);

      // Find first word and assume it is the command
      const firstWord = command.substr(0, command.indexOf(' '));

      switch (firstWord) {
         case 'coffee':
         {
            // Start coffee maker
            coffeeController.getCoffee(1);

            // Wait 2 seconds and turn off
            // setInterval(() => {
            //    coffeeController.getCoffee(0)
            // }, 2000);
            response.send("Poured!");
            break;
         }
         case 'lights':
         {
            coffeeController.hitLights(1);
            response.send("Lights have been turned off!");
            break;
         }
         // Needs capital S for some reason...
         case 'Search':
         {
            // Grab remainder of command
            const query = command.substr(command.indexOf(' ')+1);

            const res = googleSearcher.googleSearch(query);
            res.then(function(result) {
               console.log("FROM index: ", result);
               response.send(result.toString());
            }).catch(err => {
               console.log("ERROR: ", err);
            })
            break;
         }
         default:
            console.log("Unidentified command");
            response.send("Could not understand command");
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
