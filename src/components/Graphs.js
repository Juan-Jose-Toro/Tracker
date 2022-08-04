import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Pie, Bar } from 'react-chartjs-2';

const pieOptions = {
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context) => {
          let label = context.formattedValue || '';
          return label + '%';
        }
      }
    }
  }
}

const barOptions = {
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.formattedValue || '';
          return label + ' hours';
        }
      }
    }
  }
}

export default function Graphs(props) {
  const categories = Object.keys(props.categoryPercentages);
  const percentages = Object.values(props.categoryPercentages);

  const pieData = {
    labels: categories,
    datasets: [{
        label: '',
        data: percentages,
        backgroundColor: [
          '#545677',
          '#fde047',
          '#ec4899',
          '#FECEE9'
        ],
        borderWidth: 5,
        cutout: '80%',
        borderRadius: 20,
    }]
  }

  const barData = {
    labels: categories,
    datasets: [{
        label: '',
        data: percentages.map(p => p * 0.24),
        backgroundColor: [
          '#545677',
          '#fde047',
          '#ec4899',
          '#FECEE9'
        ],
        cutout: '80%',
        borderRadius: 10,
    }]
  }

  return (
    <div>
      <p className='mt-8 text-center'><u>Distribution of day in percentages by category</u></p>
      <Pie className='mx-auto mt-4' data={pieData} options={pieOptions} />
      <p className='mt-10 text-center'><u>Distribution of time in hours by category</u></p>
      <Bar className='mx-auto mt-4' data={barData} options={barOptions} />
    </div>
  );
}