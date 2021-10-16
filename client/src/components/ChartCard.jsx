import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import {Chart} from './BarChart'

export const ChartCard = (props) => {
  return (

    <Card styles = {{height:"100%"}}>

        <CardContent>

            <Typography variant="h5" component="div">
            {props.title}
            </Typography>

            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.subtitle}
            </Typography>

            <Chart chartData = {props.chartData}/>

        </CardContent>

    </Card>
 
  );
};