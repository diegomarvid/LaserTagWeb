import { Bar } from "react-chartjs-2";

export const Chart = (props) => {
  return (
    <div>
      <Bar
        data={{
            labels: props.chartData.labels,
            datasets: [
              {
                label: "",
                data: props.chartData.data,
                backgroundColor: props.chartData.colors
              }
            ]
        }}
        options={{
          // maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }

        }}
      />
    </div>
  );
};