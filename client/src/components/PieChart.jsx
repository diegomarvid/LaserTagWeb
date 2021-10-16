
import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";

export const PieChart = (props) => {
  return (
    <div>
      <Pie
        // width={"70%"}
        data={{
            labels: props.chartData.labels,
            datasets: [
              {
                label: "",
                data: props.chartData.data,
                backgroundColor: props.chartData.colors,
                borderColor: "#1F1B24"
              }
            ],
        }}
        options={{

            maintainAspectRatio: false,

            plugins: {
                title: {
                    text: props.title,
                    display: false,
                    color: "white",
                    font: {
                    size: 14
                    }
                },  
            },
          
        }}
      />
    </div>
  );
};