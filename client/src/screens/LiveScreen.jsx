import React, {useState, useEffect} from 'react';
import { io } from "socket.io-client";

import {
    Grid,
    Box,
    Typography
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import TeamIcon from '@mui/icons-material/Group';
import AliveIcon from '@mui/icons-material/Favorite';
import DeadIcon from '@mui/icons-material/DeleteForever';

import Lottie from 'react-lottie';
import liveAnimation from '../animations/live2';
import heartAnimation from '../animations/heart';
import waitAnimation from '../animations/wait';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: liveAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: heartAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const defaultOptions3 = {
    loop: true,
    autoplay: true,
    animationData: waitAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

function NotStarted(props)
{

    return(
        <>
        <Grid container id="row" align = "center">
            
            <Grid item xs={12} md={12} lg={12}>
                <Box sx ={{pt:2}}>
                    <Typography variant="h4" component="div">
                        El juego no ha comenzado 
                    </Typography>
                </Box>
            </Grid>
            
        </Grid>

        <Grid container id="row" align = "center">
            <Grid item xs={12} md={12} lg={12}>
                <Lottie 
                    options={defaultOptions3}
                    height={200}
                    width={400}
                />
            </Grid>
        </Grid>
  
        </>
    )

}


function LiveList(props)
{

    return (

    <>

    <Grid container id="row" align = "center">

            <Grid item xs={12} md={12} lg={12}>

            
                <Lottie 
                    options={defaultOptions}
                    height={100}
                    width={100}
                />
                   
                

                </Grid>
            
            </Grid>

            <Grid item xs={0} sm={0} md={3} lg = {4}></Grid>

            <Grid item xs={12} sm={12} md={6} lg = {4}>

            
                <List>

                {props.liveData.map( (player) => (

                    <Grid container id="row">

                        <ListItem
                            key = {player.id}                        
                        >
                            <Grid item xs={2} md={2}></Grid>
                            <Grid item xs={2} md={2}>
                                <ListItemIcon> 
                                    <TeamIcon sx={{ color: player.color, fontSize: 40 }}/>
                                </ListItemIcon>            
                            </Grid>
                            
                            <Grid item xs={4} md={4}>
                                <ListItemText>
                                    <Typography sx ={{ml: 2}}variant="h6" component="div">
                                        {player.id}
                                    </Typography>
                                </ListItemText>
                            </Grid>

                            <Grid item xs={4} md={4} align = "center">
                                {player.alive ?
                                    <Lottie 
                                    options={defaultOptions2}
                                    height={30}
                                    width={30}
                                    /> :
                                    <Box pr={0.4}>
                                        <DeadIcon/>
                                    </Box>
                                }
                            </Grid>

                        </ListItem>

                    </Grid>

                ))}
                    

                </List>

            </Grid>

    </>

    );
    
}  

function LiveScreen(props)
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

        {props.start ?
            <LiveList start = {props.start} liveData = {liveData}/>
        :
            <NotStarted/>
        }
        
            
        </Grid>
        </>

    );

}

export default LiveScreen;