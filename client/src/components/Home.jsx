import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {Chart} from './Chart'
// var randomColor = require('randomcolor');



function Home()
{

    const [TotalDamages, setTotalDamages] = useState([]);
    const [chartData, setChartData] = useState({})

    const playersNames = [{id: 'c', name: "Diego"}, {id: 'a', name: "Otte"},{id: 'b', name: "Claudio"},{id: 'd', name: "Torreta"}]
    useEffect( () => {


        const sendPlayersNames = async () => {
            const res = await axios.post('/api/PlayersNames', {names: playersNames});
        }
    
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
        // sendPlayersNames()

    
    },[])
    

    return (
        <div>
            <h1>Home</h1>
            <Chart chartData={chartData} />
        </div>
    )

}

export default Home;