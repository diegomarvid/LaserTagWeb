import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {Chart} from './BarChart'

import {
  Box,
  Button,
  Grid,
  Paper
 
} from '@mui/material';

const sendPlayersNames = () => {
  const playersNames = [{id: 'c', name: "Diego"}, {id: 'a', name: "Otte"},{id: 'b', name: "Claudio"},{id: 'd', name: "Torreta"}]
  console.log("Envio los nombres: " , playersNames)
  axios.post('/api/Start', {names: playersNames});
}



function Home()
{
 
    useEffect( () => {

    
    
    },[])
    

    return (
        <div>
          <Grid container>
            <Grid item xs = {12} md = {4}>
            </Grid>

            <Grid item xs = {12} md = {5}>
                <h1>Bienvenido a Laser Tag vs Kid Killer Machine</h1>
            </Grid>

            <Grid item xs = {12} md = {2}>
            </Grid>
          </Grid>
        </div>
    )

}

export default Home;