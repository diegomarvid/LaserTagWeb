import React, {useState, useEffect} from 'react';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import LoadingButton from '@mui/lab/LoadingButton';

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

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
      width: "50%"
    },
    largeIcon: {
        width: 60,
        height: 60,
      },
  });

 
function NamesList(props)
{
    return (
            <List>

                <ListItem>
                                  
                    <ListItemText
                    primary={ <Typography variant="h5" style={{ color: '#ffffff65', fontWeight: 'bold'  }}>ID</Typography>}
                    /> 

                    <ListItemText
                    primary={

                    <Box sx={{ml:-5}}>
                        <Typography variant="h5" style={{ fontWeight: 'bold'  }}>Nombre</Typography>
                    </Box>
                    }
                    />

                </ListItem>

            <Divider sx = {{bgcolor: "#FFFFFF"}}/>

            {props.data.map( (player) => (

                <ListItem
                    key = {player.id}
                    secondaryAction={
                    <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick = {() => {
                        let newData = props.data.filter(function(x) { return x.id != player.id; }); 
                        props.setData(newData)
                    }}
                    >
                        <DeleteIcon />
                    </IconButton>
                    }
                >
                    
                    <ListItemText
                    primary={ <Typography variant="h5" style={{ color: '#ffffff65' }}>{player.id}</Typography>}
                    /> 

                    <ListItemText
                    primary={<Typography variant="h6">{player.name}</Typography>}
                    />

                </ListItem>

            ))}
            </List>
    );
}

export default function InteractiveList(props) {

    const classes = useStyles();

    const [data, setData] = useState([
        {id: 'c', name: 'Diego'},
        {id: 'a', name: "Otte"}
    ])

    const [id, setId] = useState('');
    const [name, setName] = useState('');

    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAcceptDialog = () => {
        setOpen(false);
        SendPlayersNames();
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect( () => {

        const receivePlayers = async () => {
            
            try{
                const result = await axios.post('/api/ReceivePlayersIdName', {});
                const players = result.data;
                setData(players);
                setLoading(false);
            } catch(error)
            {
                console.log(error.response)
            }
            
        }

        receivePlayers();
    
    },[])

    function IdAlreadyExists(newId)
    {
        return  data.filter((x) => x.id == newId).length > 0;
    }

    function NameAlreadyExists(newName)
    {
        return  data.filter((x) => x.name == newName).length > 0;
    }

    function addPlayer()
    {

        //Chequear si es vacio y eso
        if(id.length == 0){
            errorNotify("El id no puede estar vacio")
            return;
        }

        if(name.length == 0){
            errorNotify("El nombre no puede estar vacio")
            return;
        }

        if(IdAlreadyExists(id)){
            errorNotify(`El id [${id}] ya esta ingresado`);
            return;
        }

        if(NameAlreadyExists(name)){
            errorNotify(`El nombre [${name}] ya esta ingresado`);
            return;
        }

        console.log(IdAlreadyExists(id));

        let newPlayer = {id: id, name: name};
        setData([...data, newPlayer])
        setId('');
        setName('');
    }

    const SendPlayersNames = () => {

        if(data.length < 2){
            errorNotify(`Deben haber por lo menos 2 jugadores ingresados.`);
            return;
        }
        
        console.log("Envio los nombres: " , data)
 
        axios.post('/api/SendPlayerNames', {players: data})
        .then( response => {
            setLoading(false);
            console.log(response.data)
            notify();
        })
        .catch(error => {
            console.log(error.response.status)
            errorNotify("Conexion perdida con el servidor")
        })
        
    }

    const notify = () => {
        toast.success('Jugadores enviados con exito', {
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
                <Typography sx={{ mt: 4, mb: 4 }} variant="h4" component="div">
                    Nombres de los jugadores
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
                    <NamesList data={data} setData={setData}/>
                }
                

            </Grid>

        </Grid>
   
                        
        <Grid id="row" container>
            <Grid item xs={0} md={4} ></Grid>
            <Grid item xs={12} md={4} align = "center">

                <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                    Agregar jugador
                </Typography>

            </Grid>
        </Grid>

        <Grid id="row" container spacing = {1}>

            <Grid item xs={1} md={4} ></Grid>

            <Grid item xs={4} md={2} align = "center">

                <TextField 
                id="idText" 
                label="Id" 
                variant="outlined" 
                value={id}
                onInput={ e => {
                    e.target.value = e.target.value.slice(0,1);
                    setId(e.target.value)
                }}
                />

            </Grid>

            <Grid item xs={4} md={2}>

                <TextField 
                id="nombreText" 
                label="Nombre" 
                variant="outlined" 
                value={name} 
                onInput={ e => {
                    e.target.value = e.target.value.slice(0,10);
                    setName(e.target.value);
                }}
                />

            </Grid> 

            <Grid item xs={1} md={2}>
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
            <Grid item xs={12} md={12} align="center">
                <Box pt={6}>
                    <Typography sx={{ mt: 0, mb: 0 }} variant="h5" component="div">
                            Enviar Lista
                    </Typography>
                </Box>
            </Grid>
        </Grid>


        <Grid id="row" container>

            <Grid item xs={3} md={4} ></Grid>

            <Grid item xs={6} md={4}
            align="center"
            >
                <Box pt={2}>
                    <Button 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        size = "large"
                        color = "success"
                        onClick = {handleClickOpen}
                        disabled = {props.start}
                        >
                            Enviar
                    </Button>
                </Box>
            </Grid>

        </Grid>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Enviar jugadores"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Desea enviar los jugadores?
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
    
       
  );
}