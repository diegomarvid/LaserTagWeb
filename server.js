const express = require('express');
var mqtt = require('mqtt');
const cors = require('cors');
const path = require('path');


const MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 8080;

const app = express();

let server = require('http').Server(app);

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
    
// app.listen(PORT, console.log(`Server started on port ${PORT}`));
server.listen(PORT, function() {
    console.log("Server listening at " + PORT);
});

let io = require('socket.io')(server, {});

// ************************** SOCKET IO *****************************//

io.sockets.on('connection', function(socket) {

    socket.on('disconnect', function() {
        console.log('socket disconnection')
    });

});

let LivePlayersData = [];

setInterval(function() {

    if(GAME_STARTED)
    {
        io.sockets.emit('live', LivePlayersData);
    }
    
      

}, 1000)

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

let GAME_STARTED = false;

app.post('/api/IsGameStarted', (req, res) => 
{
    res.send(GAME_STARTED)

});

app.post('/api/Start', (req, res) => 
{
    console.log("Game has started...")

    db.collection("Teams").find({}).toArray(function(err, teams)
    {


        db.collection("Players").find({}).toArray(function(err, players)
        {
            
            for(let i in players)
            {
                let player = players[i];
                LivePlayersData.push({id: player.name, team: player.team, alive:true});
            }

            LivePlayersData = AddColorToPlayerList(teams, LivePlayersData);

            try{
                LivePlayersData = LivePlayersData.sort((player1, player2) => player2.team.localeCompare(player1.team))
            } catch(e)
            {

            }
            

            console.log(LivePlayersData)

            client.publish(StartTopic, "");
            GAME_STARTED = true;
        
        });

    });


});


app.post('/api/ReceivePlayers', (req, res) => 
{

    console.log("Voy a enviar los jugadores...")

   db.collection("Teams").find({}).toArray(function(err, teams)
   {
        if (err) throw err;


        db.collection("Players").find({}).toArray(function(err, result)
        {
            if (err) throw err;
    
            let players = [];

            for(let i in result)
            {
                let player = result[i];
                players.push({id: player.id, team: player.team, name: player.name})
            }

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

app.post('/api/SendPlayerNames', (req, res) => 
{
    if(GAME_STARTED) return;

    const PlayersNames = req.body.players;

    // console.log(PlayersNames)

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

});

app.post('/api/GetPlayerNames', (req, res) => 
{

    db.collection("Players").find({}).toArray(function(err, players) {

        if(err) throw err;

        let playersNames = [];

        for(let i in players)
        {
            let player = players[i];
            playersNames.push(player.name);
        }

        res.send(playersNames);
        console.log(playersNames)
    });
    

});

function CreateTotalDamageArrayFromHits(hits , playersData, teams)
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

    total_damages = AddColorsToHitsList(total_damages, playersData, teams);
    
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

function CreateEmptyTeamDamageArray(teams){
    
    let total_damage_by_teams = [];

    for(let i in teams)
    {
        let team = teams[i]

        total_damage_by_teams.push({id: team.id, color: team.color, damage: 0});
    }

    return total_damage_by_teams;

}

function CreateTeamsTotalDamageArrayFromPlayersTotalDamage(total_damage_by_players, players, teams)
{
    let total_damage_by_teams = CreateEmptyTeamDamageArray(teams);

    for(let i in total_damage_by_players)
    {
        let player = total_damage_by_players[i];

        let player_info = players.find( x => x.name == player.id)

        if(player_info != null)
        {
            let player_team = player_info.team;
    
            if(player_team != null){
            
                let my_team_index = total_damage_by_teams.findIndex( x => x.id == player_team);

                if(my_team_index != -1)
                {
                    total_damage_by_teams[my_team_index].damage += player.damage;
                }

            }

        }
    

    }

    total_damage_by_teams = total_damage_by_teams.sort((team1, team2) => team2.damage - team1.damage);

    return total_damage_by_teams;
}

function CreateEmptyPlayerDamageArray(players, playerName, teams){
    
    let damage_by_player = [];

    for(let i in players)
    {
        let player = players[i]

        if(player.name != playerName){
            damage_by_player.push({id: player.name, damage: 0, team: player.team});
        }

    }

    damage_by_player = AddColorToPlayerList(teams, damage_by_player)

    return damage_by_player;

}

app.post('/api/DamageMadeByPlayer', (req, res) => 
{  
    let playerName = req.body.name;

    if(playerName == null)
    {
        console.log("No hay jugador");
        return;
    }

    console.log(`Mandando datos de damage a ${playerName}`);

    db.collection("Teams").find({}).toArray(function(err, teams) {

        if(err) throw err;

        db.collection("Players").find({}).toArray(function(err, players) {

            if(err) throw err;
    
            let total_damage_by_player = CreateEmptyPlayerDamageArray(players, playerName, teams);

            let total_damage_received = CreateEmptyPlayerDamageArray(players, playerName, teams);

            db.collection("Hits").find({}).toArray(function(err, hits) {
    
                if(err) throw err;


    
                for(let i in hits)
                {
                    let enemy = hits[i];
        
                    let enemyName = enemy.id;
        
                    //Veo quien le hizo damage a enemy y si estoy yo se lo sumo
                    for(let i in enemy.Hits)
                    {
                        let hit = enemy.Hits[i];
    
                        if(hit.id == playerName)
                        {
                            let enemy_player_index = total_damage_by_player.findIndex(x => x.id == enemyName);
                            if(enemy_player_index != -1){                        
                                total_damage_by_player[enemy_player_index].damage += hit.damage;
                            }
                        }

                        //Los damage que me hicieron
                        if(enemyName == playerName)
                        {
                            console.log("Agrego danos a claudios")
                            let enemy_player_index = total_damage_received.findIndex(x => x.id == hit.id);      
                            if(enemy_player_index != -1){            
                                total_damage_received[enemy_player_index].damage += hit.damage;
                            }
                        }
    
    
                    }
                    
                }

                total_damage_by_player = total_damage_by_player.sort((player1, player2) => player2.damage - player1.damage);
                total_damage_received = total_damage_received.sort((player1, player2) => player2.damage - player1.damage);

                let stats = {
                    made: total_damage_by_player,
                    received: total_damage_received
                }
                res.send(stats)
            })
    
    
        });

    });
    
    

});

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
        
               let total_damage_by_players = CreateTotalDamageArrayFromHits(hits, playersData, teams);

               let total_damage_by_teams = CreateTeamsTotalDamageArrayFromPlayersTotalDamage(total_damage_by_players, playersData, teams);
    

               let rankings = {
                   TotalDamagePlayers: total_damage_by_players,
                   TotalDamageTeams: total_damage_by_teams
               }
               res.send(rankings);
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
        if(GAME_STARTED)
        {
            HandleDieTopic();  
        }
         
    }

    if(topic == SendDamageTakenTopic)
    {
        if(!GAME_STARTED){
            HandleSendDamageTakenTopic();
        }
        
    }

    if(topic == TeamTopic)
    {
        if(!GAME_STARTED)
        {
            HandleTeamTopic();
        }
       
    }

});

function HandleDieTopic()
{

    let id = payload.id;

    db.collection("Players").findOne({id: id}, function(err, player){

        if(err) throw err;

        let team = player.team;

        db.collection("Teams").findOneAndUpdate(
            { id: team},
            { $inc: { cantidadJugadores: -1 } }, 
            function (err, result){


                console.log("Murio " + player.name);

                //Setear persona muerta en live array
                let deadPersonIndex = LivePlayersData.findIndex((x) => x.id == player.name);
                LivePlayersData[deadPersonIndex].alive = false;

                db.collection("Teams").find({}).toArray(function(err, teams){
                    

                    let aliveTeams = teams.filter( x => x.cantidadJugadores > 0);
                    
                    if(aliveTeams.length == 1)
                    {
                        console.log("Termino el juego");
                        console.log("Gano el equipo " + aliveTeams[0].id);
                        GAME_STARTED = false;
                        client.publish(SendDamageTopic, "");
                    }

                })
            }
        )



    });

    // players_died++;

    // console.log(`Jugador muerto [${players_died}/${PLAYERS_NUMBER} jugadores]`);

    // if(players_died == PLAYERS_NUMBER - 1)
    // {
    //     console.log("Avisando a los usuarios que manden su damage");
    //     client.publish(SendDamageTopic, "");
    //     players_died = 0;
    // }
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

    //Busco jugador con el id
    db.collection("Players").findOne({id: id}, function(err, player){
        if (err) throw err;

        if(player == null){
            console.log("No se asocio el jugador a la pistola con id: " + id);
        } else{

            //Obtengo equipo original del jugador con el id
            let playerTeam = player.team;

            console.log(`Equipo viejo: [${playerTeam}] | Equipo nuevo: [${team}]`)

            //Cambio el equipo del jugador deseado
            db.collection("Players").updateOne(query, {$set: {team: team}}, function (err, result){
        
                if (err) throw err;

                console.log(`Player ${player.name} [${id}] paso a equipo ${team}`)
        
                //Incremento en 1 la cantidad de jugadores del nuevo equipo
                db.collection("Teams").findOneAndUpdate(
                    { id: team},
                    { $inc: { cantidadJugadores: 1 } },  

                    function(err, result){

                        console.log(`Incrementando cantidad jugadores por 1 en ${team}`)   
                        console.log(result)

                        //Si ya tenia equipo decremento en 1 la cantidad de jugadores del equipo viejo
                        if(playerTeam != null)
                        {       
                            db.collection("Teams").findOneAndUpdate(
                                { id: playerTeam},
                                { $inc: { cantidadJugadores: -1 } }, function (err, result){
                                    console.log(`Decrementando cantidad de jugadores por 1 en ${playerTeam}`)    
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