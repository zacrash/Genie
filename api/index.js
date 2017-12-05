// Node server
const express = require('express');
const path = require('path');

const parser = require('./parse_commands');
const coffeeController = require('./coffee_controller');
const lightController = require('./light_controller');
const googleSearcher = require('./google_searcher');

const app = express();
const port = process.env.PORT || 3001;

// Routes
app.get('/', (request, response) => {
  response.send('Welcome to Genie');
});
app.post('/command', (request, response) => {

   const getParse = parser.parse(request.body);
   // TODO: Generator function here?
   getParse.then(function (result){
      // Transcript of voice command
      const command = result.command;

      // Find first word and assume it is the command
      const firstWord = command.substr(0, command.indexOf(' '));

      switch (firstWord) {
         case 'coffee':
         {
            // return coffeeController.getCoffee((res, er) => {
            //    if (er) {
            //       console.log("Error while getting coffee", er);
            //    }
            //    else {
            //       console.log("Got Coffee", res);
            //       response.send("Got Coffee!");
            //    }
            // });
            // break;
            console.log("Received Coffee");
            break;
         }
         case 'lights':
         {
            return lightController.switchLights((res, er) => {
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
            // Grab remainder of command
            const query = command.substr(command.indexOf(' ')+1);

            const res = googleSearcher.gSearch(query);
            if (res.failed) {
               console.log("Error while google searching");
            }
            else {
               console.log("Search results: ", res);
               response.send("Searching!");
            }
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
