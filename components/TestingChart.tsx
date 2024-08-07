import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, Point } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface GameData {
  endTime: number;
  ratingAfterGameEnd: number;
}

interface RatingChartProps {
  data: GameData[];
}

const RatingChart = ({ data, chartTitle, titleX, titleY }:any) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
   const createChart = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current!.getContext('2d');
    
    // Create an array of points that will be plotted on the chart
    const ratings: Point[] = data.map((itm:number, idx:number) => ({
      x: idx,
      y: itm,
    }));

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: [
          {
            label: chartTitle,
            data: ratings,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.4, // Add this for smooth curves
            cubicInterpolationMode: 'monotone', // Ensure smooth curve
          },
        ],
      },
      options: {
        scales: {
          x: {
            type:'linear',
            title: {
              display: true,
              text: titleX,
            },
          },
          y: {
            title: {
              display: true,
              text: titleY,
            },
          },
        },
      },
    };
    chartInstanceRef.current = new Chart(ctx!, config);
  }

    createChart();

    const handleResize = () => {
      createChart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chartInstanceRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return <div className="relative h-64"><canvas ref={chartRef} /></div>
};

export default RatingChart;