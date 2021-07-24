const express = require('express');
var mqtt = require('mqtt');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const url = 'mqtt://broker.hivemq.com';

var client = mqtt.connect(url)

client.on("connect", function(){	
    console.log("connected:  " + client.connected);
})

const topic_o = "LaserTag/ranking";

client.subscribe(topic_o);


let payload;

client.on('message', function(topic, message, packet){
    payload = JSON.parse(message)
	console.log(payload)
});