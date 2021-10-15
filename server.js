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


app.post('/api/ReceivePlayers', (req, res) => 
{

    console.log("Voy a enviar los jugadores...")

   db.collection("Teams").find({}).toArray(function(err, teams)
   {
        if (err) throw err;


        db.collection("Players").find({}).toArray(function(err, result)
        {
            if (err) throw err;
    
            let players = result;

            players = AddColorToPlayerList(teams,players);
    
            res.send(players)
        })
   })

});

function AddColorToPlayerList(teams, players)
{
    for(let i in players)
    {
        let player = players[i];

        let myTeam = teams.find( team => team.id == player.team );

        if(myTeam != null)
        {
            players[i].color = myTeam.color;   
        } else{
            players[i].color = "#8d8d8d";   
        }
    }

    return players;
}

let PLAYERS_NUMBER = 2;

app.post('/api/SendPlayerNames', (req, res) => 
{

    const PlayersNames = req.body.players;

    console.log(PlayersNames)

    try {
        if(PlayersNames != null)
        {
            //Clean databases
            db.collection("Players").remove({});
            //db.collection("Hits").remove({});

            //Add players names
            db.collection("Players").insertMany(PlayersNames);
        }
        
        
     } catch (e) {
        console.log(e);
     }


     PLAYERS_NUMBER = PlayersNames.length;

    //  client.publish(StartTopic, "Pepe");
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

function AddColorsToHitsList(hits, playersData, teams)
{
 
    for(let i in hits)
    {
        let hit = hits[i];

        let player = playersData.find( x => x.name == hit.id );

        if(player != null)
        {
            let team = player.team;

            if(team != null)
            {
                let color = teams.find( x => x.id == team).color;
    
                hits[i].color = color;
            } else
            {
                hits[i].color = "#8d8d8d";
            }
        } else{
            hits[i].color = "#8d8d8d";
        }

        

    }

    return hits;

}

app.post('/api/TotalDamage', (req, res) => 
{    
    console.log("Envio ranking")

    db.collection("Teams").find({}).toArray(function(err, teams) {

        if (err) throw err;

        if(teams == null){
            console.log("No se encontraron equipos correspondientes");
            return;
        } 

        db.collection("Players").find({}).toArray(function(err, playersData) {

            if (err) throw err;
    
            if(playersData == null){
                console.log("No se encontraron jugadores correspondientes");
                return;
            } 
    
            db.collection("Hits").find({}).toArray(function(err, hits) {
        
                if (err) throw err;
        
                if(hits == null) {
                    console.log("No se encontraron hits correspondientes");
                    return;
                } 
        
               let total_damages = CreateTotalDamageArrayFromHits(hits);
    
               total_damages = AddColorsToHitsList(total_damages, playersData, teams);
    
               //Mandar el resultado
               res.send(total_damages);
            });
    
        });

    })


})

// ************************* MQTT ************************************ //

const url = 'mqtt://broker.hivemq.com';

var client = mqtt.connect(url)

client.on("connect", function(){	
    console.log("Connected to MQTT:  " + client.connected);
})

const root_topic = "LaserTag/";

let DiedTopic = root_topic + "Died";
let SendDamageTakenTopic = root_topic + "SendDamageTaken";
let SendDamageTopic = root_topic + "SendDamage";
let StartTopic = root_topic + "Start";
let TeamTopic = root_topic + "Team";

client.subscribe(DiedTopic);
client.subscribe(SendDamageTakenTopic);
client.subscribe(TeamTopic);



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

    if(topic == TeamTopic)
    {
        HandleTeamTopic();
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

    let name = GetNameById(payload.id, playersNames);

    if(name != null){
        newPayload.id = name;
    }else{
        newPayload.id = "Desconocido";
    }
    
    for(let i in payload.Hits)
    {
        let name = GetNameById(payload.Hits[i].id, playersNames);

        if(name != null){
            newPayload.Hits[i].id  = name;
        }else{
            newPayload.Hits[i].id = "Desconocido";
        }

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

function HandleTeamTopic()
{
    console.log("Jugador conectado, escribiendo equipo...");

    let id = payload.id;
    let team = payload.team;

    let query = {id: id};

    db.collection("Players").findOne({id: id}, function(err, result){
        if (err) throw err;

        if(result == null){
            console.log("No se asocio el jugador a la pistola con id: " + id);
        } else{

            let playerTeam = result.team;

            console.log("El equipo del jugador es: " + playerTeam)
            console.log("El nuevo equipo va a ser: " + team);

            db.collection("Players").update(query, {$set: {team: team}}, function (err, result){
        
                if (err) throw err;
        
                db.collection("Teams").findOneAndUpdate(
                    { id: team},
                    { $inc: { cantidadJugadores: 1 } },  

                    function(err, result){

                        // console.log("resultado de cambiar equipo y sumar: ", result)

                        //Ya estaba en un equipo, se esta cambiando
                        if(playerTeam != null)
                        {
                            
                            
                            db.collection("Teams").findOneAndUpdate(
                                { id: playerTeam},
                                { $inc: { cantidadJugadores: -1 } }, function (err, result){
                                    // console.log("resultado de decrementar a mi equipo: ", result)
                                }
                            )
                        }

                    }
                )
            });

        }
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