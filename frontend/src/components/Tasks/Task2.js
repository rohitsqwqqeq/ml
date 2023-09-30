// Plot a stacked bar chart of matches won of all teams over all the years of IPL
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Task2 = () => {
    const [teams, setTeams] = useState([])
    const [years, setYears] = useState([])
    const [matchesWon, setMatchesWon] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/match/route22", {});
                setTeams(response.data.allTeams);
                setYears(response.data.years);
                setMatchesWon(response.data.matchesWon);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();
    }, []);

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Matches Won',
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const generateRandomColor = () => {
        return `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.6)`;
    };
    
    const labels = teams;
    const datasets = matchesWon.map((matches, index) => ({
        label: years[index],
        data: matches,
        backgroundColor: generateRandomColor(),
    }));
    
    const data = {
        labels,
        datasets
    };

    return (
        <>
            <Bar options={options} data={data} />;
            <div style={{ textAlign: "center" }}>
                <h4>Fig 2: Matches won by all teams each year</h4>
            </div>
        </>
    );
};

export default Task2;
