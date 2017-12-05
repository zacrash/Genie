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
app.get('/command', (request, response) => {
   const getParse = parser.parse(request.body.command);
   console.log("getParse:", getParse);

   // getParse.then(function (result){
      // Transcript of voice command
      //const command = result.text;
      //console.log("Command:", command);
      const command = "Coffee please";
      // Find first word and assume it is the command
      const firstWord = command.substr(0, command.indexOf(' '));

      switch (firstWord) {
         case 'Coffee':
         {
            // Start coffee maker
            coffeeController.getCoffee(1);

            // Wait 2 seconds and turn off
            // setInterval(() => {
            //    coffeeController.getCoffee(0)
            // }, 2000);

            break;
         }
         case 'Lights':
         {
            break;
         }
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
            console.log("Unidentified command:", command);
            response.send("Could not understand command", command);
      }
   // }).catch(err => {
   //    console.log("ERROR: ", err);
   // })
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`Listening on ${port}`);
});
