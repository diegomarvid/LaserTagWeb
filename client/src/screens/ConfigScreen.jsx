import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/AddCircle';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';


const useStyles = makeStyles({
    fullHeightButton: {
      height: "100%",
      width: "50%"
    },
    largeIcon: {
        width: 60,
        height: 60,
      },
  });

 


export default function InteractiveList() {

    const classes = useStyles();

    const [data, setData] = useState([
        {id: 'c', name: 'Diego'},
        {id: 'a', name: "Otte"}
    ])

    const [id, setId] = useState('');
    const [name, setName] = useState('');

    useEffect( () => {

        const receivePlayers = async () => {
 
            const result = await axios.post('/api/ReceivePlayers', {});
            const players = result.data;
            setData(players);
        }

        receivePlayers();
    
    },[])

    function addPlayer()
    {
        let newPlayer = {id: id, name: name};
        setData([...data, newPlayer])
        setId('');
        setName('');
    }

    const SendPlayersNames = () => {
        console.log("Envio los nombres: " , data)
        axios.post('/api/SendPlayerNames', {players: data});
    }

  return (
   
    <Grid container spacing={2}>

        <Grid id="row" container>
            <Grid item xs={4} md={4} ></Grid>

            <Grid item xs={4} md={4} align = "center">
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    Nombres de los jugadores
                </Typography>
            </Grid>
        </Grid>

        <Grid id="row" container>

            <Grid item xs={4} md={4} ></Grid>
            
            <Grid item xs={4} md={4}>

                <List>

                {data.map( (player) => (

                    <ListItem
                        secondaryAction={
                        <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick = {() => {
                            let newData = data.filter(function(x) { return x.id != player.id; }); 
                            setData(newData)
                        }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        }
                    >
                        
                        <ListItemText
                        primary={player.id}
                        /> 

                        <ListItemText
                        primary={player.name}
                        fontSize = "15"
                        />

                    </ListItem>

                ))}
                    
        
                </List>

            </Grid>

        </Grid>
   
                        
        <Grid id="row" container>
            <Grid item xs={4} md={4} ></Grid>
            <Grid item xs={4} md={4} align = "center">

                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    Agregar jugador
                </Typography>

            </Grid>
        </Grid>

        <Grid id="row" container>

            <Grid item xs={4} md={4} ></Grid>

            <Grid item xs={2} md={2} align = "center">

                <TextField 
                id="idText" 
                label="Id" 
                variant="outlined" 
                value={id}
                onInput={ e => setId(e.target.value)}
                />

            </Grid>

            <Grid item xs={2} md={2}>

                <TextField 
                id="nombreText" 
                label="Nombre" 
                variant="outlined" 
                value={name} 
                onInput={ e => setName(e.target.value)}
                />

            </Grid> 

            <Grid item xs={2} md={2}>
                <IconButton
                iconStyle ={classes.largeIcon}
                onClick = {addPlayer}
                >
                    <AddIcon
                    fontSize="large"
                    color = "secondary"
                     />
                </IconButton>
            
            </Grid> 

        </Grid>

        <Grid id="row" container>

            <Grid item xs={4} md={4} ></Grid>

            <Grid item xs={2} md={4}
            align="center"
            >
                <Box pt={6}>
                    <Button 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        size = "large"
                        color = "success"
                        classes={{root: classes.fullHeightButton}}
                        onClick = {SendPlayersNames}
                        >
                            Enviar
                    </Button>
                </Box>
            </Grid>

        </Grid>


    </Grid>
    
       
  );
}