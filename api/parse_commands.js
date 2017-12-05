// Parse Commands from Google Speech

function getAction(command) {
  var result = {text: command}
    if (command.includes("coffee"))
      result.action = "coffee";
    else if (command.includes("light") || command.includes("lights"))
      result.action =  "lights";
    else if (command.includes("search"))
      result.action =  "search";
    else
      result.action = "none";
    return result;
}

exports.parse = function (audioFile) {

	// Imports the Google Cloud client library
	const speech = require('@google-cloud/speech');
	const fs = require('fs');

	// Your Google Cloud Platform project ID
	const projectId = 'rugged-sunbeam-185822';

	// set environment variable
	//process.env['GOOGLE_APPLICATION_CREDENTIALS'] = "private/googleSpeechCredentials.json";

	// Creates a client
	const client = new speech.SpeechClient({ });

	// const fileName = 'resources/search_nb.3gp';
	const fileName = audioFile;

	// Reads a local audio file and converts it to base64
	const file = fs.readFileSync(fileName);
	const audioBytes = file.toString('base64');

	// The audio file's encoding, sample rate in hertz, and BCP-47 language code
	const audio = {
	  content: audioBytes,
	};
	// const config = {
	//   encoding: 'FLAC',
	//   sampleRateHertz: 16000,
	//   languageCode: 'en-US',
	// };
	const config = {
	  encoding: 'AMR',
	  sampleRateHertz: 8000,
	  languageCode: 'en-US',
	};
	const request = {
	  audio: audio,
	  config: config,
	};
	let getParse = function (request) {
		return new Promise( function (resolve, reject) {
		client
		  .recognize(request)
		  .then(data => {
		    const response = data[0];
		    const transcription = response.results
		      .map(result => result.alternatives[0].transcript)
		      .join('\n');
		    resolve (getAction(transcription));
		  })
		  .catch(err => {
		    console.error('ERROR:', err);
		  });
	})
	};

	return getParse(request);

}
