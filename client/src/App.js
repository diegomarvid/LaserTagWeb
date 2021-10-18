import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import Home from './components/Home';
import Nav from './components/Nav';
import RankingScreen from './screens/RankingScreen';
import NamesScreen from './screens/NamesScreen';
import ConexionScreen from './screens/ConexionScreen';
import LiveScreen from './screens/LiveScreen';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import axios from 'axios';

import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

import { deepOrange, grey } from '@mui/material/colors';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {

  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const [start, setStart] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: deepOrange,
          divider: "#141414",
          background: {
            default: "#1F1B24",
            paper: "#1F1B24",
          },
          text: {
            primary: '#ffffff',
            secondary: "#ffffff65",
          },
    },
  });

  const darkTheme2 = createTheme({
    palette: {
      mode: 'dark'
    }

  });

  useEffect( () => {

    //pedir estado del juego
    const setGameInitialState = async () => {
 
      try{
        const result = await axios.post('/api/IsGameStarted', {});
        const gameInitialState = result.data;
        setStart(gameInitialState);
      } catch(error){
        console.log(error.response.data)
      }
      
    }

    setGameInitialState();

  },[])


  return(

    <ThemeProvider theme={darkTheme}>

    <Router>
                

      <Switch>

        <Route path="/live">
            <Nav start={start}/>
            <LiveScreen start={start}/>
        </Route>

        <Route path="/connections">
          <Nav start={start}/>
            <ConexionScreen start = {start} setStart={setStart}/>
        </Route>

        <Route path="/config">
          <Nav start={start}/>
            <NamesScreen start={start}/>
        </Route>

        <Route path="/ranking">
            <Nav start={start}/>
            <RankingScreen/>
        </Route>

        <Route path="/">
            <Nav start={start}/>
            <Home/>
        </Route>      

      </Switch>
                              
    </Router>

    </ThemeProvider>
  
  )
 
  
}

export default App;
