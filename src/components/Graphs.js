import { Chart as ChartJS } from "chart.js/auto";
import { Pie, Bar } from "react-chartjs-2";

// import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const pieOptions = {
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context) => {
          let label = context.formattedValue || "";
          return label + "%";
        },
      },
    },
  },
};

const barOptions = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.formattedValue || "";
          return label + " hours";
        },
      },
    },
  },
};

export default function Graphs(props) {
  const categories = Object.keys(props.categoryPercentages);
  const percentages = Object.values(props.categoryPercentages);
  // const colors = ["#545677", "#fde047", "#ec4899", "#f73663", "#FECEE9"];
  const colors = [
    ...useSelector((store) => store.categories).map(
      (category) => category.color
    ),
    "violet",
    "#FECEE9",
  ];

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "",
        data: percentages,
        backgroundColor: colors,
        borderWidth: 5,
        cutout: "80%",
        borderRadius: 20,
      },
    ],
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "",
        data: percentages.map((p) => p * 0.24),
        backgroundColor: colors,
        cutout: "80%",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div>
      <h2 className="mt-2 text-base font-bold">
        Distribution of day in percentages by category
      </h2>
      <Pie className="mx-auto mt-4" data={pieData} options={pieOptions} />
      <h2 className="mt-8 font-bold">
        Distribution of time in hours by category
      </h2>
      <Bar className="mx-auto mt-4" data={barData} options={barOptions} />
    </div>
  );
}
