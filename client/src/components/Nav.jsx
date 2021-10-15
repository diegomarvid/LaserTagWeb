import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useHistory } from 'react-router-dom';


export default function Nav() {

  let history = useHistory();

  function HandleHomeClick()
  {
    console.log('Home clicked');
    history.push("/")
  }

  function HandleRankingClick()
  {
    console.log('Ranking clicked');
    history.push("/ranking")
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick = {HandleHomeClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>

            <Button 
            color="inherit"
            onClick = {HandleRankingClick}
            >
            Ranking
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}