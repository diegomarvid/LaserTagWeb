import React, {useState, useEffect} from 'react';
import {
    Grid
} from '@mui/material';
import axios from 'axios';

import {ChartCard} from '../components/ChartCard'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function RankingScreen()
{
    const [TotalDamagePlayersChartData, setTotalDamagePlayersChartData] = useState({labels: [], data: [], color: []});
    const [TotalDamageTeamsChartData, setTotalDamageTeamsChartData] = useState({labels: [], data: [], color: []});
    const [TotalDamageByPlayerChartData, setTotalDamageByPlayerChartData] = useState({labels: [], data: [], color: []});
    const [TotalDamageReceivedByPlayerChartData, setTotalDamageReceivedByPlayerChartData] = useState({labels: [], data: [], color: []});

    const [playerSelected, setPlayerSelected] = useState('');
    const [playersNames, setPlayerNames] = useState([]);

    const [chartPlayerName, setChartPlayerName] = useState('');
    

    const receivePlayerNames = async () => {
        const res = await axios.post("/api/GetPlayerNames");

        setPlayerNames(res.data);
        console.log(res.data);

    };

    const receiveTotalDamages = async () => {
        const res = await axios.post("/api/TotalDamage");
  
        let TotalDamagePlayers = res.data.TotalDamagePlayers;


        setTotalDamagePlayersChartData({

          labels: TotalDamagePlayers.map((player) => player.id),
          data: TotalDamagePlayers.map((player) => player.damage),
          colors: TotalDamagePlayers.map((player) => player.color)
            
        });

        let TotalDamageTeams = res.data.TotalDamageTeams;

        setTotalDamageTeamsChartData({

            labels: TotalDamageTeams.map((player) => player.id),
            data: TotalDamageTeams.map((player) => player.damage),
            colors: TotalDamageTeams.map((player) => player.color)
              
        });
    };

    function GetDamageByPlayer()
    {
        if(playerSelected == '') return;

        axios.post('/api/DamageMadeByPlayer', {name: playerSelected})
        .then( response => {
            

            setChartPlayerName(playerSelected);
            
            let TotalDamageMade = response.data.made;

            setTotalDamageByPlayerChartData({

                labels: TotalDamageMade.map((player) => player.id),
                data: TotalDamageMade.map((player) => player.damage),
                colors: TotalDamageMade.map((player) => player.color)
                  
            });

            let TotalDamageReceived = response.data.received;

            setTotalDamageReceivedByPlayerChartData({

                labels: TotalDamageReceived.map((player) => player.id),
                data: TotalDamageReceived.map((player) => player.damage),
                colors: TotalDamageReceived.map((player) => player.color)
                  
            });
        })
            
   
    }

    useEffect( () => {

        receiveTotalDamages();
        receivePlayerNames();
    
    },[])

    return (

        <>
        <Grid container spacing={0}>

            <Grid container id="row">

                <Grid item xs = {12} md = {6} align = "center">
                    
                    <Box m={2}>

                        <ChartCard 
                        title = "Ranking de Damage"
                        subtitle = "Por Jugadores"
                        chartData = {TotalDamagePlayersChartData}
                        />

                    </Box>
                </Grid>

                <Grid item xs = {12} md = {6} align = "center">
                    
                    <Box m={2}>

                        <ChartCard 
                        title = "Ranking de Damage"
                        subtitle = "Por Equipos"
                        chartData = {TotalDamageTeamsChartData}
                        />

                    </Box>

                </Grid>

                
            </Grid>

            <Grid container id="row">

                <Grid item xs={12} md={4} >

                    <Grid container id="row">
                        <Grid item xs={12} md={12} align="center" >
                            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                                Seleccionar estadisticas personalizadas
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container id="row">

                        <Grid item xs={12} md={12} align="left" >

                            <Box m = {2} pt = {3} sx={{ minWidth: 120 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="jugadorLabel" label="Jugador" variant = "outlined">Jugador</InputLabel>

                                        <Select
                                        labelId="demo-simple-jugadorLabel-label"
                                        id="jugadorSelect"
                                        value={playerSelected || ''}
                                        label="Jugador"
                                        onChange={(e) => setPlayerSelected(e.target.value)}
                                        >
                                            {playersNames.map( name => {

                                                return (
                                                    <MenuItem key={name} value={name}>
                                                        {name}
                                                    </MenuItem>
                                                )
                                            })}                             
                                        </Select>

                                    </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
               

                    <Grid container id="row">

                        <Grid item xs={12} md={12} align="left" >

                            <Box m={2} pt = {1}>
                                <Button 
                                    variant="contained" 
                                    color = "success"
                                    size = "large"       
                                    style={{width: "100%"}}              
                                    onClick = {GetDamageByPlayer}
                                    >
                                        Enviar
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                
                </Grid>
       
                <Grid item xs = {12} md = {4}>
                    
                    <Box m={2}>

                        <ChartCard 
                        title = "Damage Hecho"
                        subtitle = {chartPlayerName}
                        chartData = {TotalDamageByPlayerChartData}
                        />

                    </Box>
           
                </Grid>

                <Grid item xs = {12} md = {4}>
                    
                    <Box m={2}>

                        
                        <ChartCard 
                        title = "Damage Recibido"
                        subtitle = {chartPlayerName}
                        chartData = {TotalDamageReceivedByPlayerChartData}
                        />

                    </Box>

                </Grid>
     
            </Grid>
        </Grid>
        </>
    )

}

export default RankingScreen;