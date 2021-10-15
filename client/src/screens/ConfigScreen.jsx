import React, {useState, useEffect} from 'react';
import {
    Grid
} from '@mui/material';
import axios from 'axios';
import {Chart} from '../components/Chart'

function ConfigScreen()
{

    useEffect( () => {

    
    },[])

    return (

        <>
        <Grid container spacing={5}>

            <Grid item xs = {12} md = {2}>
            </Grid>

            <Grid item xs = {12} md = {8}>
                <p>Configuracion</p>
            </Grid>

            <Grid item xs = {12} md = {2}>
            </Grid>

        </Grid>
        </>
    )

}

export default ConfigScreen;