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

const Task22 = () => {
  const [teams, setTeams] = useState([])
  const [matchesWon, setMatchesWon] = useState([])
  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/match/route2", {});

        setTeams(response.data.teams);
        setMatchesWon(response.data.matchesWon);
        // console.log(response.data.teams);
        // console.log(response.data.matchesWon);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, []);

  const data = {
    labels: teams,
    datasets: [
      {
        label: 'Sample Data',
        data: matchesWon,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
    <div>
      <Bar
        data={data}
        height={112}
        width={200}
      />
      <div style={{textAlign:"center"}}>
        <h4>Fig 2: Matches won by all teams</h4>
      </div>
    </div>
    </>
  );
};

export default Task22;
