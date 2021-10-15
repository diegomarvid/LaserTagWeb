import { Bar } from "react-chartjs-2";

export const Chart = ({ chartData }) => {
  return (
    <div>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              text: "Ranking de Damage",
              display: true,
              color: "white",
              font: {
                size: 14
              }
            },  
          },
          scales: {
            xAxes: [ {
              type: 'time',
              display: true,
              grid: {
                color: 'red',
                borderColor: 'red',
                tickColor: 'red'
              },
              ticks: {
                fontColor: "white",
              }
              // scaleLabel: {
              //   display: true,
              //   labelString: 'Date'
              // }          
            } ],
            yAxes: [ {
              display: true,
              gridLines: {
                display: true ,
                color: 'rgba(255, 255, 255, 0.8)'
              },
              scaleLabel: {
                display: true,
                labelString: 'value'
              }
            } ],
            
          }
        }}
      />
    </div>
  );
};