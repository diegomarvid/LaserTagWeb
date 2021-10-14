const express = require('express');
var mqtt = require('mqtt');
const cors = require('cors');
const path = require('path');
var randomColor = require('randomcolor');

const MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json())
app.use(cors());

app.use(express.static(path.join(__dirname, 'client', 'public')))

app.post("/", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});
    
app.listen(PORT, console.log(`Server started on port ${PORT}`));

// ************************* MONGO DB ******************************** //


let db;


async function main(){

    // Connect to the MongoDB cluster
    const uri = "mongodb+srv://root:admin@cluster0.i2lgv.mongodb.net/test";

    try {
        
        client_mongodb = await MongoClient.connect(uri);

        console.log("Connected to MongoDB successfully")
  
        db = client_mongodb.db("Turret");

        
    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }
  }
  
main().catch(console.error);

//************************** EXPRESS ************************************//

let PLAYERS_NUMBER = 2;

app.post('/api/Start', (req, res) => 
{

    const PlayersNames = req.body.names;

    //Add colors
    for(let i in PlayersNames)
    {
        PlayersNames[i].color = randomColor();
    }


    try {

        //Clean databases
        db.collection("Players").remove({});
        //db.collection("Hits").remove({});

        //Add players names
        db.collection("Players").insertMany(PlayersNames);
        
     } catch (e) {
        print (e);
     }


     PLAYERS_NUMBER = PlayersNames.length;

     client.publish(StartTopic, "Pepe");
     console.log("Starting game...");


});

function CreateTotalDamageArrayFromHits(hits)
{

    let total_damages = [];

     //Recorro cada resultado de Hit
     for(let i in hits)
     {
         let player = hits[i];

         //Recorro los golpes que recibio cada jugador
         for(let j in player.Hits)
         {
             let player_hit = player.Hits[j];
 
             //Me fijo si ya esta en la lista de damage
             player_index = IsPlayerInDamageArray(player_hit, total_damages);

             if(PlayerIsNotInDamageArray(player_index))
             {
                 total_damages.push(player_hit);
             } else // Si esta le sumo el damage
             {
                total_damages[player_index].damage += player_hit.damage;
             }
         }

     }   
       
    total_damages = OrderTotalDamageArrayByDamage(total_damages);
    
    return total_damages;
}

function OrderTotalDamageArrayByDamage(hits)
{
    return hits.sort((player1, player2) => player2.damage - player1.damage);
}

function IsPlayerInDamageArray(player_hit, total_damages)
{
    return total_damages.findIndex(x => x.id === player_hit.id);
}

function PlayerIsNotInDamageArray(player_index)
{
    return player_index === -1;
}

function AddColorsToPlayerList(hits, playersData)
{
 
    for(let i in hits)
    {
        let hit = hits[i];
        let player = playersData.find( x => x.name == hit.id );
        hits[i].color = player.color;
    }

    return hits;

}

app.post('/api/TotalDamage', (req, res) => 
{    

    db.collection("Players").find({}).toArray(function(err, playersData) {

        if (err) throw err;

        db.collection("Hits").find({}).toArray(function(err, hits) {
    
            if (err) throw err;
    
            if(hits == null) {
                console.log("No se encontraron hits correspondientes");
                return;
            } 
    
           let total_damages = CreateTotalDamageArrayFromHits(hits);

           total_damages = AddColorsToPlayerList(total_damages, playersData);

           //Mandar el resultado
           res.send(total_damages);
        });

    });

    

})

// ************************* MQTT ************************************ //

const url = 'mqtt://broker.hivemq.com';

var client = mqtt.connect(url)

client.on("connect", function(){	
    console.log("connected:  " + client.connected);
})

const root_topic = "LaserTag/";

let DiedTopic = root_topic + "Died";
let SendDamageTakenTopic = root_topic + "SendDamageTaken";
let SendDamageTopic = root_topic + "SendDamage";
let StartTopic = root_topic + "Start";

client.subscribe(DiedTopic);
client.subscribe(SendDamageTakenTopic);



let players_died = 0;

let payload;

client.on('message', function(topic, message, packet){
    
    payload = JSON.parse(message);

    console.log(topic);
	console.log(payload);

    if(topic == DiedTopic)
    {
       HandleDieTopic();    
    }

    if(topic == SendDamageTakenTopic)
    {
        HandleSendDamageTakenTopic();
    }

});

function HandleDieTopic()
{
    players_died++;

    console.log(`Jugador muerto [${players_died}/${PLAYERS_NUMBER} jugadores]`);

    if(players_died == PLAYERS_NUMBER - 1)
    {
        console.log("Avisando a los usuarios que manden su damage");
        client.publish(SendDamageTopic, "");
        players_died = 0;
    }
}

function GetNameById(id, playersNames)
{
    return playersNames.find(player => player.id == id).name;
}

function ChangePayloadIDToNames(payload, playersNames)
{
    let newPayload = payload;

    newPayload.id = GetNameById(payload.id, playersNames);

    for(let i in payload.Hits)
    {
        newPayload.Hits[i].id = GetNameById(payload.Hits[i].id, playersNames);
    }

    return newPayload;
}

function HandleSendDamageTakenTopic()
{
    console.log("Guardando tu damage en db...");

    db.collection("Players").find({}).toArray(function(err, result) {

        let PlayersNames = result;
     
        let newPayload = ChangePayloadIDToNames(payload, PlayersNames)

        console.log(newPayload)

        db.collection("Hits").insertOne(newPayload,function(err, result) {
            if (err) throw err;
            console.log("Success inserting hit");
        });


    })


}

// const hit = {

//     id: 'c',
//     Hits: [
//       { id: 'a', damage: 20 },
//       { id: 'b', damage: 66 },
//       { id: 'd', damage: 11 }
//     ]
//   }

//   { 
//     "id": "c",
//     "Hits": [
//       { "id": "a", "damage": 10 },
//       { "id": "b", "damage": 5 },
//       { "id": "d", "damage": 1 }
//     ]
//   }