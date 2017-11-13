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


function parseCommands(audioFile) {

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

// Your Google Cloud Platform project ID
const projectId = 'rugged-sunbeam-185822';

// set environment variable
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = "googleSpeechCredentials.json";

// Creates a client
const client = new speech.SpeechClient(
{  // projectId: projectId,
}
);

// The name of the audio file to transcribe
// const fileName = './resources/makeMeCoffee.flac';
// const fileName = './resources/searchWeather.flac';
// const fileName = './resources/turnOnLights.flac';
const fileName = audioFile;


// Reads a local audio file and converts it to base64
const file = fs.readFileSync(fileName);
const audioBytes = file.toString('base64');

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
// file type: .flac
// bir resoultion: 16 bit
// sampling rate: 16000 hertz
// audio channel: mono

const audio = {
  content: audioBytes,
};

const config = {
  encoding: 'FLAC',
  sampleRateHertz: 16000,
  languageCode: 'en-US',

  
};
const request = {
  audio: audio,
  config: config,
};

// Detects speech in the audio file

client
  .recognize(request)
  .then(data => {
    const response = data[0];
    // text = Object.assign({}, response.results);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    console.log("Action:", getAction(transcription));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

  

}


module.exports = parseCommands;