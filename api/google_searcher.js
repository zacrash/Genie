const request = require('request');


const API_HOST = 'https://www.googleapis.com/customsearch/v1';
const key = 'AIzaSyCWBs-Mb0v5Q5-HRuee6WeW04Oq7yuAP80';
const cse_id = '016668177693725831692:o7hzfpokj-y';

function googleSearch(query) {
   var promise = new Promise((reject, resolve) => {
      const url = `${API_HOST}?q=${query}&cx=${cse_id}&key=${key}`;
      const requestOptions = {
         url,
         method: 'GET'
      };
      request(requestOptions, (_, response, body) => {
         // Success
         if (response.statusCode === 201 || response.statusCode === 200) {
            console.log(JSON.parse(body).items[0].snippet);
            resolve(JSON.parse(body).items[0].snippet);
         }
         else {
            reject("failed");
         }
      });
   });
   return promise;
}

module.exports = {googleSearch};
