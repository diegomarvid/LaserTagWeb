const express = require('express');
var mqtt = require('mqtt');
const cors = require('cors');
const path = require('path')

const PORT = process.env.PORT || 8080;
const INDEX = '/index.html';

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

const app = express();

app.use(express.json())
app.use(cors());

app.use(express.static(path.join(__dirname, 'client', 'build')))

app.post("/", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
    
app.listen(PORT, console.log(`Server started on port ${PORT}`));


const url = 'mqtt://broker.hivemq.com';

var client = mqtt.connect(url)

client.on("connect", function(){	
    console.log("connected:  " + client.connected);
})

const root_topic = "LaserTag/";

let DiedTopic = root_topic + "Died";
let SendDamageTakenTopic = root_topic + "SendDamageTaken";
let SendDamageTopic = root_topic + "SendDamage";

client.subscribe(DiedTopic);
client.subscribe(SendDamageTakenTopic);


let PLAYERS_NUMBER = 2;

let players_died = 0;

let payload;

client.on('message', function(topic, message, packet){
    
    payload = JSON.parse(message)
    console.log(topic);
	console.log(payload);

    if(topic == DiedTopic){
       players_died++;

        if(players_died == PLAYERS_NUMBER - 1)
        {
            client.publish(SendDamageTopic, "");
            players_died = 0;
        }
        
    }

});