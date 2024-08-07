import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, ChartConfiguration } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface GameNumbers {
  won: number;
  lost: number;
  draw: number;
  inProgress: number;
}

interface PieChartProps {
  gameNumbers: GameNumbers;
}

const PieChart: React.FC<PieChartProps> = ({ gameNumbers }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current!.getContext('2d');
    const data = {
      labels: [
        `Wins: ${gameNumbers.won}`,
        `Loses: ${gameNumbers.lost}`,
        `Draws: ${gameNumbers.draw}`,
        `In Progress: ${gameNumbers.inProgress}`
      ],
      datasets: [
        {
          data: [
            gameNumbers.won,
            gameNumbers.lost,
            gameNumbers.draw,
            gameNumbers.inProgress
          ],
          backgroundColor: ['#7ABA78', '#FF6384', '#FFCE56', '#36A2EB'],
          hoverBackgroundColor: ['#7ABA78', '#FF6384', '#FFCE56', '#36A2EB']
        }
      ]
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 18 // Adjust font size here
            }
          }
        }
      }
    };

    const config: ChartConfiguration = {
      type: 'pie',
      data: data,
      options: options,
    };

    chartInstanceRef.current = new Chart(ctx!, config);

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [gameNumbers]);

  return <canvas ref={chartRef} />;
};

export default PieChart;