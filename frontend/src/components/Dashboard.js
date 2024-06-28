import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [apiHits, setApiHits] = useState([]);
  const [browserData, setBrowserData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    fetchApiHits();
  }, []);

  const fetchApiHits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hits');
      setApiHits(response.data);
      processBrowserData(response.data);
      processBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching API hits:', error);
    }
  };

  const processBrowserData = (data) => {
    const browserCount = data.reduce((acc, hit) => {
      const browser = hit.user_agent.split(' ')[0]; // Simplified browser extraction
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.keys(browserCount).map(browser => ({
      name: browser,
      value: browserCount[browser],
      color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color for each browser
    }));

    setBrowserData(formattedData);
  };

  const processBarChartData = (data) => {
    const ipCount = data.reduce((acc, hit) => {
      const ip = hit.ip_address;
      acc[ip] = (acc[ip] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.keys(ipCount).map(ip => ({
      name: ip,
      count: ipCount[ip]
    }));

    setBarChartData(formattedData);
  };

  return (
    <div className="dashboard">
      <h2>API Hits Table</h2>
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Request Type</th>
            <th>Request Time</th>
            <th>IP Address</th>
            <th>OS</th>
            <th>User Agent</th>
          </tr>
        </thead>
        <tbody>
          {apiHits.map(hit => (
            <tr key={hit.id}>
              <td>{hit.request_id}</td>
              <td>{hit.request_type}</td>
              <td>{new Date(hit.request_time).toLocaleString()}</td>
              <td>{hit.ip_address}</td>
              <td>{hit.os}</td>
              <td>{hit.user_agent}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>API Hits by Browser</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={browserData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
        >
          {browserData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      <h2>API Hits by IP Address</h2>
      <BarChart width={600} height={300} data={barChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Dashboard;
