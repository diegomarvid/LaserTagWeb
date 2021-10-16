import React, {useState, useEffect} from 'react';
import {
    Grid
} from '@mui/material';
import axios from 'axios';
import {Chart} from '../components/BarChart'
import {PieChart} from '../components/PieChart'

import {ChartCard} from '../components/ChartCard'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

function RankingScreen()
{
    const [chartData, setChartData] = useState({labels: [], data: [], color: []});

    const receiveTotalDamages = async () => {
        const res = await axios.post("/api/TotalDamage");
  
        console.log("Seteando TotalDamage a: ", res.data);
  
        let ranking = res.data;

        setChartData({

          labels: ranking.map((player) => player.id),
          data: ranking.map((player) => player.damage),
          colors: ranking.map((player) => player.color)
            
        });
    };

    useEffect( () => {

        receiveTotalDamages();
    
    },[])

    return (

        <>
        <Grid container spacing={0}>

            {/* <Grid container id="row">
     
            <Grid item xs = {12} md = {2}>
            </Grid>

            <Grid item xs = {12} md = {8} align = "center">
                {/* <Chart chartData = {chartData} title = "Ranking de Damage" /> 
                <div style = {{height: "500px", width: "500px"}}>
                   
                <PieChart chartData = {chartData} title = "Ranking de Damage" />
                </div>
            </Grid>

            </Grid> */}

            <Grid container id="row">

            {/* <Grid item xs = {6} md = {2}> </Grid> */}
               

                <Grid item xs = {12} md = {6} align = "center">
                    
                    <Box m={2}>

                        <ChartCard 
                        title = "Ranking de Damage"
                        subtitle = "Por Equipos"
                        chartData = {chartData}
                        />

                    </Box>
                </Grid>

                <Grid item xs = {12} md = {6} >
                    
                    <Box m={2}>

                        <ChartCard 
                        title = "Ranking de Damage"
                        subtitle = "Por Equipos"
                        chartData = {chartData}
                        />

                    </Box>

                    {/* <Box m={2}>

                        <ChartCard 
                        title = "Ranking de Damage"
                        subtitle = "Por Equipos"
                        chartData = {chartData}
                        />

                    </Box> */}
                </Grid>

                
            </Grid>

            <Grid container id="row">

                <Grid item xs = {12} md = {4}>
                    
                <Box m={2}>

                    <ChartCard 
                    title = "Ranking de Damage"
                    subtitle = "Por Equipos"
                    chartData = {chartData}
                    />

                </Box>
           
                </Grid>

                <Grid item xs = {12} md = {4}>
                    
                <Box m={2}>

                    
                    <ChartCard 
                    title = "Ranking de Damage"
                    subtitle = "Por Jugadores"
                    chartData = {chartData}
                    />

                </Box>
                </Grid>

                <Grid item xs = {12} md = {4}>
                    
                    <Box m={2}>
                        
                        <ChartCard 
                        title = "Ranking de Kills"
                        subtitle = "Por Jugadores"
                        chartData = {chartData}
                        />
                    </Box>
                </Grid>
            
            </Grid>
        </Grid>
        </>
    )

}

export default RankingScreen;