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

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Lottie from 'react-lottie';
import loadingAnimation from '../animations/loading';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

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
        return <NoTeamIcon sx={{ color: '#8d8d8d', fontSize: 30}}/>;
    } else{
        return  <TeamIcon sx={{ color: props.player.color, fontSize: 30 }}/>;
    }
}

function StartGame(props)
{
    axios.post("/api/Start")
    .then(response => {
        console.log("Starting game...")
        notify();
        props.setStart(true);
    })
    .catch(error => {
        console.log(error.response.data);
        errorNotify("Conexion perdida con el servidor");
    });
   
}

const notify = () => {
    toast.success('Juego empezado con exito', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme:'dark',
    });
};

const errorNotify = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme:'dark',
    });
};


function AreAllPlayersConected(players)
{ 
    for(let i in players)
    {
        let player = players[i];

        if(player.team == null)
        { 
            return false;
        }
    }

    return true;
}


function PlayersList(props)
{

    return (
        <List>

            {props.data.map( (player) => (

                <ListItem
                    key = {player.id}
                    secondaryAction={
                    <IconButton 
                    edge="end" 
                    aria-label="delete"
                    >
                        {player.team == null ? <NotConnectedIcon sx={{fontSize: 30 }}/>: <ConnectedIcon sx={{fontSize: 30 }}/>}
                    </IconButton>
                    }
                >
                    
                    
                    <ListItemIcon> 
                        <TeamPlayerIcon player={player}/>
                    </ListItemIcon> 

                    <ListItemText>           
                        <Typography sx ={{ml: 2}}variant="h6" component="div">
                                        {player.name}
                        </Typography>
                    </ListItemText>

                </ListItem>

            ))}
                
        </List>
    )
}

export default function ConexionList(props) {

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([
        {id: 'c', name: 'Diego'},
        {id: 'a', name: "Otte"},
        {id: 'b', name: "Claudio"},
        {id: 'd', name: "Torreta"}
    ])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAcceptDialog = () => {
        setOpen(false);
        StartGame(props);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function HandleStartGameClick(props)
    {
        // StartGame();

        if(AreAllPlayersConected(data)){
            StartGame(props);
        } else{
            handleClickOpen();
        }

    }

    
    useEffect( () => {

        const receivePlayers = async () => {
 
            try{
                const result = await axios.post('/api/ReceivePlayers', {});
                const players = result.data;
                setData(players);
                setLoading(false);
                console.log(players)
            }catch(error)
            {
                console.log(error);
            }
            
        }

        receivePlayers();
    
    },[])
    
 
  return (
   
    <Grid container spacing={2}>

        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />

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

                {loading ?
                    <Lottie 
                    options={defaultOptions}
                    height={200}
                    width={200}
                    />
                :
                    <PlayersList data={data}/>
                }
                
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
                        disabled = {props.start}
                        onClick = {(e) => {
                            HandleStartGameClick(props);
                        }}
                        >
                            Start
                    </Button>
                </Box>
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Faltan jugadores"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    No todos los jugadores estan conectados. Desea aun asi empezar el juego?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleAcceptDialog} autoFocus  color="secondary">
                    Aceptar
                </Button>
                </DialogActions>
            </Dialog>

        </Grid>


    </Grid>
    
       
  );
}