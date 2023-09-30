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

const Task4 = () => {
  const [bowlers, setBowlers] = useState([])
  const [economyRate, setEconomyRate] = useState([])
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
        const response = await axios.get(`http://localhost:5000/api/ball/route4?year=${year}`);
        // console.log(response)
        setBowlers(response.data.bowlers);
        setEconomyRate(response.data.economyRate);
        // console.log(response.data.bowlers);
        // console.log(response.data.economyRate);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [selectedYear]);

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
    labels: bowlers,
    datasets: [
      {
        label: 'Economy Rate (Total Runs conceded/Total Over bowled)',
        data: economyRate,
        backgroundColor: generateRandomColors(bowlers.length),
        borderColor: 'rgba(75,192,192,1)',
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
      <div style={{width:'50vw', height:'70vh'}}>
      <Bar data={data} />
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <h4>Fig 4: Top 10 Economical Bowlers in year {selectedYear}</h4>
      </div>
      </div>
    </div>
  );
};

export default Task4;
