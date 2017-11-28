const request = require('request');

const API_HOST = 'https://www.googleapis.com/customsearch/v1';
const key = process.env['search_key'];
const cse_id = process.env['cse_id'];

const gSearch = (query) => new Promise((resolve, reject) => {
   const url = `${API_HOST}?q=${query}&cx=${cse_id}&key=${key}`;
   const requestOptions = {
      url,
      method: 'GET'
   };
   request(requestOptions, (_, response, body) => {
      const res = response.body[0];
      // Success
      if (response === 201 || response === 200) {
         resolve(res);
      }
      // Failure
      else {
         reject(res);
      }
   });
})

module.exports = { gSearch };
