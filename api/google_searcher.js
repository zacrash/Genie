const request = require('request');
const rp = require('request-promise');


const API_HOST = 'https://www.googleapis.com/customsearch/v1';
const key = 'AIzaSyCWBs-Mb0v5Q5-HRuee6WeW04Oq7yuAP80';
const cse_id = '016668177693725831692:o7hzfpokj-y';


function googleSearch(query) {
   const url = `${API_HOST}?q=${query}&cx=${cse_id}&key=${key}`;
   const requestOptions = {
      uri : url,
   };

   var promise = new Promise(function (resolve, reject) {
      rp(requestOptions)
         .then(function (result) {
            console.log("RESULT from google search: ", JSON.parse(result).items[0].snippet);
            resolve(JSON.parse(result).items[0].snippet);
         })
         .catch (function (err) {
            console.log("ERROR from google search ", err);
            reject(err);
         });

   });

   return promise;

}

module.exports = {googleSearch};
