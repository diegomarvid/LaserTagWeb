import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import image from '../images/lasertag.PNG'

export default function ImageCard(props) {
  return (

    <Box sx ={{m: 2, pt:5}}>
    <Card sx={{ height: 370, maxWidth: 1000 }}>
      <CardMedia
        component="img"
        height="250"
        image={props.image}
        alt="green iguana"
      />
      <CardContent>

        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {props.subtitle}
        </Typography>

      </CardContent>

      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
    </Box>
  );
}