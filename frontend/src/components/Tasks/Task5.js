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

const Task5 = () => {
  const [teams, setTeams] = useState([])
  const [playedMatches, setPlayedMatches] = useState([])
  const [wonMatches, setWonMatches] = useState([])
  const [years, setYears] = useState();
  const [selectedYear, setSelectedYear] = useState(2017);

  useEffect(() => {
    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) {
      setSelectedYear(parseInt(storedYear, 10));
    } else {
      // If no stored year, use the default value (2017)
      setSelectedYear(2017);
    }
  }, []);
  
  const handleYearChange = (event) => {
    const selected = parseInt(event.target.value, 10);
    setSelectedYear(selected);
    // Store the selected year in localStorage
    localStorage.setItem('selectedYear', selected.toString());
  };
  

  useEffect(() => {
    const getUniqueYears = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/match/getyears");
        // console.log(response)
        setYears(response.data.uniqueYears)
        console.log(response.data.uniqueYears)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getUniqueYears();
  }, []);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const year = selectedYear;
        const response = await axios.get(`http://localhost:5000/api/match/route5?year=${year}`);
        // console.log(response)
        setTeams(response.data.teams);
        setPlayedMatches(response.data.playedMatches);
        setWonMatches(response.data.wonMatches);
        // console.log(response.data.bowlers);
        // console.log(response.data.economyRate);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [selectedYear]);

  const data = {
    labels: teams,
    datasets: [
      {
        label: 'Matches Played',
        data: playedMatches,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
      {
        label: 'Matches Won',
        data: wonMatches,
        backgroundColor: 'rgba(128,0,128,0.5)',
        borderColor: 'rgba(192, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display:'flex', flexDirection:'row' }}>
      <div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <label htmlFor="yearSelect">Select Year: </label>
        <select id="yearSelect" onChange={handleYearChange} value={selectedYear}>
          {years &&
            years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>
      </div>
      <div>
      <Bar data={data} height={130} width={200} />
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <h4>Fig 5: Matches Played and Matches Won by each Teams in year {selectedYear}</h4>
      </div>
      </div>
    </div>
  );
};

export default Task5;
