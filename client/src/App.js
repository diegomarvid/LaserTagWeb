import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import Home from './components/Home';
import Nav from './components/Nav';
import RankingScreen from './screens/RankingScreen';
import ConfigScreen from './screens/ConfigScreen';
import ConexionScreen from './screens/ConexionScreen';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { deepOrange, grey } from '@mui/material/colors';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {

  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: deepOrange,
          divider: "#1F1B24"[700],
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


  return(

    <ThemeProvider theme={darkTheme}>

    <Router>
                

      <Switch>

      <Route path="/connections">
            <Nav/>
            <ConexionScreen/>
        </Route>

        <Route path="/config">
            <Nav/>
            <ConfigScreen/>
        </Route>

        <Route path="/ranking">
            <Nav/>
            <RankingScreen/>
        </Route>

        <Route path="/">
            <Nav/>
            <Home/>
        </Route>      

      </Switch>
                              
    </Router>

    </ThemeProvider>
  
    // <>

    // {/* <Home></Home> */}
    // <RankingScreen/>
  
    // </>
  )
 
  
}

export default App;
