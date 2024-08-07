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

const RatingChart: React.FC<RatingChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current!.getContext('2d');
    
    // Create an array of points that will be plotted on the chart
    const ratings: Point[] = data.map(game => ({
      x: game.endTime * 1000,
      y: game.ratingAfterGameEnd,
    }));

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Rating Over Time',
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
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Time',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Rating',
            },
          },
        },
      },
    };

    chartInstanceRef.current = new Chart(ctx!, config);

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default RatingChart;