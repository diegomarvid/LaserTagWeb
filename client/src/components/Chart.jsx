import { Bar } from "react-chartjs-2";

export const Chart = ({ chartData }) => {
  return (
    <div>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              text: "Daños totales",
              display: true,
            }        
          },
          scales: {
            xAxes: [ {
              type: 'time',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Date'
              }          
            } ],
            yAxes: [ {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'value'
              }
            } ]
          }
        }}
      />
    </div>
  );
};