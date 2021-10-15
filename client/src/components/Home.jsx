import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {Chart} from './Chart'

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
            <h1>Home</h1>
        </div>
    )

}

export default Home;