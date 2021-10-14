const express = require('express');
var mqtt = require('mqtt');
const cors = require('cors');
const path = require('path');

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

let total_damages = [];

let db;


async function main(){

    // Connect to the MongoDB cluster
    const uri = "mongodb+srv://root:admin@cluster0.i2lgv.mongodb.net/test";

    try {
        
        client_mongodb = await MongoClient.connect(uri);

        console.log("Connected to MongoDB successfully")
  
        await listDatabases(client_mongodb);
  
  
        db = client_mongodb.db("Turret");

        // const hit = {

        //     id: 'a',
        //     Hits: [
        //       { id: 'c', damage: 5 },
        //       { id: 'b', damage: 1 }
        //     ]
        //   } 

        // db.collection("Hits").insertOne(hit,function(err, result) {
        //     if (err) throw err;
        //     console.log("Success inserting hit");
        // });

        GetTotalDamages();
        // console.log(total_damages);
    

    db.collection("Hits").findOne({id:'c'},function(err, result) {
    
        if (err) throw err;

        if(result == null) {
            console.log("No se encontraron hits correspondientes");
            return;
        } 

        

        // console.log(result.Hits);
        

    });
        
        
    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }
  }
  
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function GetTotalDamages()
{
    
    db.collection("Hits").find({}).toArray(function(err, result) {
    
        if (err) throw err;

        if(result == null) {
            console.log("No se encontraron hits correspondientes");
            return;
        } 

        // console.log(result);

        //Recorro cada resultado de Hit
        for(let i in result)
        {
            let player = result[i];

            // console.log(player)

            //Recorro los golpes que recibio cada jugador
            for(let j in player.Hits)
            {
                let player_hit = player.Hits[j];

                // console.log(player_hit)
    
                //Me fijo si ya esta en la lista de damage
                player_damage_index = total_damages.findIndex(x => x.id === player_hit.id);

                //Si no esta lo agrego
                if(player_damage_index == -1)
                {
                    total_damages.push(player_hit);
                } else // Si esta le sumo el damage
                {
                    total_damages[player_damage_index].damage += player_hit.damage;
                }
            }

        }   
          
       console.log(total_damages);
    });

}
  
  main().catch(console.error);

  



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

client.subscribe(DiedTopic);
client.subscribe(SendDamageTakenTopic);

let PLAYERS_NUMBER = 2;

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

function HandleSendDamageTakenTopic()
{
    console.log("Guardando tu damage en db...");
    // console.log(payload.Hits)
}

const hit = {

    id: 'c',
    Hits: [
      { id: 'a', damage: 20 },
      { id: 'b', damage: 66 },
      { id: 'd', damage: 11 }
    ]
  }

//   { 
//     "id": "c",
//     "Hits": [
//       { "id": "a", "damage": 20 },
//       { "id": "b", "damage": 66 },
//       { "id": "d", "damage": 11 }
//     ]
//   }