// Plot a stacked bar chart of matches won of all teams over all the years of IPL
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as Chartjs,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2';

Chartjs.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const Task1 = () => {
  const [years, setYears] = useState([])
  const [matches, setMatches] = useState([])
  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/match/route1", {});
        setYears(response.data.years);
        setMatches(response.data.numMatches);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, []);

  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.6)`;
      colors.push(randomColor);
    }
    return colors;
  };

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Matches Played',
        data: matches,
        backgroundColor: generateRandomColors(years.length),
        borderColor: 'rgba(255, 255, 255, 3)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
    <div>
      <Bar
        data={data}
        height={91}
        width={200}
      />
      <div style={{textAlign:"center", paddingTop:"40px"}}>
        <h4>Fig 1: Matches played in each year</h4>
      </div>
    </div>
    </>
  );
};

export default Task1;
