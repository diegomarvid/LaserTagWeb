import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import Home from './components/Home';
import Nav from './components/Nav';
import RankingScreen from './screens/RankingScreen';
import ConfigScreen from './screens/ConfigScreen';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {


  


  return(

    <Router>
                

      <Switch>

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
  
    // <>

    // {/* <Home></Home> */}
    // <RankingScreen/>
  
    // </>
  )
 
  
}

export default App;
