import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';

import image1 from '../images/lasertag.PNG';
import image2 from '../images/stats.PNG';
import image3 from '../images/turret.png';


import {
  Box,
  Button,
  Grid,
  Paper,
  Typography
 
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
            <Grid container id="row" align = "center">
              <Grid item xs={12} md={12} lg={12}>
                  <Typography sx ={{ml: 2}}variant="h4" component="div">
                      Bienvenido a Laser Tag vs Machine
                  </Typography>
              </Grid>
            </Grid>

          
            <Grid container id="row" align = "center">

              <Grid item xs={12} md={12} lg={4}>
                  <ImageCard title ="Variedades de canchas" subtitle="Hasta 5 canchas completamente diferentes" image = {image1}/>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                  <ImageCard title ="Estadisticas personalizadas" subtitle="Puedes comparar con tus amigos los daños que hicieron para ver realmente quien es el mejor jugador." image = {image2}/>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                  <ImageCard title ="Torretas guardianas" subtitle="Las canchas cuentan con torretas equipadas con inteligecia artificial para hacer la experiencia aun mas divertida." image = {image3}/>
              </Grid>

            </Grid>
          </Grid>
        </div>
    )

}

export default Home;