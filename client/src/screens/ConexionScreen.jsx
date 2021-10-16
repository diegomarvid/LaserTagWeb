import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import TeamIcon from '@mui/icons-material/Group';
import NoTeamIcon from '@mui/icons-material/HighlightOff';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import NotConnectedIcon from '@mui/icons-material/SignalWifiBad';
import ConnectedIcon from '@mui/icons-material/Wifi';

import axios from 'axios';


const useStyles = makeStyles({
    fullHeightButton: {
      height: "100%",
      width: "50%",
    },
    largeIcon: {
        width: 60,
        height: 60,
      },
  });

function TeamPlayerIcon(props)
{
    if(props.player.team == null)
    {
        return <NoTeamIcon sx={{ color: '#8d8d8d'}}/>;
    } else{
        return  <TeamIcon sx={{ color: props.player.color }}/>;
    }
}

function StartGame()
{
    axios.post("/api/Start");
    console.log("Starting game...")
  
}


export default function ConexionList() {

    const classes = useStyles();

    
    useEffect( () => {

        const receivePlayers = async () => {
 
            const result = await axios.post('/api/ReceivePlayers', {});
            const players = result.data;
            setData(players);
        }

        receivePlayers();
    
    },[])
    

    const [data, setData] = useState([
        {id: 'c', name: 'Diego', team: 'r', color: '#990000'},
        {id: 'a', name: "Otte"},
        {id: 'b', name: "Claudio", team: 'r', color: '#990000'},
        {id: 'd', name: "Torreta", team: 'b', color: '#0000cc'}
    ])

    const [id, setId] = useState('');
    const [name, setName] = useState('');

    function addPlayer()
    {
        let newPlayer = {id: id, name: name};
        setData([...data, newPlayer])
        setId('');
        setName('');
    }

  return (
   
    <Grid container spacing={2}>

        <Grid id="row" container>

            <Grid item xs={0} md={4} ></Grid>

            <Grid item xs={12} md={4} align = "center">
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    Jugadores conectados
                </Typography>
            </Grid>
        </Grid>

        <Grid id="row" container>

            <Grid item xs={1} md={4} ></Grid>
            
            <Grid item xs={10} md={4}>

                <List>

                {data.map( (player) => (

                    <ListItem
                        key = {player.id}
                        secondaryAction={
                        <IconButton 
                        edge="end" 
                        aria-label="delete"
                        >
                            {player.team == null ? <NotConnectedIcon/>: <ConnectedIcon/>}
                        </IconButton>
                        }
                    >
                        
                        
                        <ListItemIcon> 
                            <TeamPlayerIcon player={player}/>
                        </ListItemIcon> 

                        <ListItemText
                        primary={player.name}
                        />

                    </ListItem>

                ))}
                    
        
                </List>

            </Grid>

        </Grid>
   
                        

        <Grid id="row" container>

            <Grid item xs={3} md={4} ></Grid>

            <Grid item xs={6} md={4}
            align="center"
            >
                <Box pt={6}>
                    <Button 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        size = "large"
                        classes={{root: classes.fullHeightButton}}
                        color="success"
                        onClick = {StartGame}
                        >
                            Start
                    </Button>
                </Box>
            </Grid>

        </Grid>


    </Grid>
    
       
  );
}