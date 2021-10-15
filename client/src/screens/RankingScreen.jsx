import React, {useState, useEffect} from 'react';
import {
    Grid
} from '@mui/material';
import axios from 'axios';
import {Chart} from '../components/Chart'

function RankingScreen()
{
    const [chartData, setChartData] = useState({});

    const receiveTotalDamages = async () => {
        const res = await axios.post("/api/TotalDamage");
  
        console.log("Seteando TotalDamage a: ", res.data);
  
        let ranking = res.data;

        setChartData({
          labels: ranking.map((player) => player.id),
          datasets: [
            {
              label: "",
              data: ranking.map((player) => player.damage),
              backgroundColor: ranking.map((player) => player.color)
            }
          ]
        });
    };

    useEffect( () => {

        receiveTotalDamages();
    
    },[])

    return (

        <>
        <Grid container spacing={5}>

            <Grid item xs = {12} md = {2}>
            </Grid>

            <Grid item xs = {12} md = {8}>
                <Chart chartData={chartData} />
            </Grid>

            <Grid item xs = {12} md = {2}>
            </Grid>

        </Grid>
        </>
    )

}

export default RankingScreen;