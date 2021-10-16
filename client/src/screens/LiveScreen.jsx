import React, {useState, useEffect} from 'react';
import { io } from "socket.io-client";

import {
    Grid
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import TeamIcon from '@mui/icons-material/Group';
import AliveIcon from '@mui/icons-material/Favorite';
import DeadIcon from '@mui/icons-material/DeleteForever';

import ConnectedIcon from '@mui/icons-material/Wifi';

function LiveScreen()
{

    const [liveData, setLiveData] = useState([]);

    useEffect(() => {

        const socket = io();

        socket.on("live", data => {
            setLiveData(data);
            console.log(data)
        });

      }, []);
    

    return(

        <>
        <Grid container>
            <Grid item xs={10} md={6}>

                <List>

                {liveData.map( (player) => (

                    <ListItem
                        key = {player.id}
                        secondaryAction={
                        <IconButton 
                        edge="end" 
                        aria-label="delete"
                        >
                          
                            {player.alive ?
                            <AliveIcon sx={{ color: '#ff3232'}}/> :
                            <DeadIcon/>
                            }
                           
                        </IconButton>
                        }
                    >
                        
                        <ListItemIcon> 
                            <TeamIcon sx={{ color: player.color }}/>
                        </ListItemIcon>

                        <ListItemText
                        primary={player.id}
                        />

                    </ListItem>

                ))}
                    

                </List>

            </Grid>
        </Grid>
        </>

    );

}

export default LiveScreen;