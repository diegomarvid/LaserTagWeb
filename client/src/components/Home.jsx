import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {Chart} from './Chart'
// var randomColor = require('randomcolor');



function Home()
{

    const [TotalDamages, setTotalDamages] = useState([]);
    const [chartData, setChartData] = useState({})


    useEffect( () => {

    
        const receiveTotalDamages = async () => {
            const res = await axios.post("/api/TotalDamage");

            console.log("Seteando TotalDamage a: ", res.data);

            let ranking = res.data;

            setTotalDamages(ranking);

            setChartData({
              labels: ranking.map((player) => player.id),
              datasets: [
                {
                  label: "",
                  data: ranking.map((player) => player.damage),
                  backgroundColor: ranking.map((player) => player.color)
                }
              ]
            });
        };

        receiveTotalDamages()

    
    },[])
    

    return (
        <div>
            <h1>Home</h1>
            <Chart chartData={chartData} />
        </div>
    )

}

export default Home;