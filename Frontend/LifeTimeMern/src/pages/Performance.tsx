import React, { useState, useEffect } from 'react';
import API from '../api/api';
import Button from '../components/ui/Button';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Performance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const user = localStorage.getItem('token');

  useEffect(() => {
    if (user) {
      fetchPerformanceData();
    }
  }, [currentMonth, user]);

  const fetchPerformanceData = async () => {
    try {
      const response = await API.get(`/performance/current-month`);
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth.toISOString().slice(0, 7));
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth.toISOString().slice(0, 7));
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getActivityData = () => {
    if (!performanceData || !performanceData.activities) return { labels: [], datasets: [] };

    const dates = performanceData.activities.map(activity => new Date(activity.date).toLocaleDateString());
    const completed = performanceData.activities.map(activity => activity.completed ? 1 : 0);
    const incomplete = performanceData.activities.map(activity => !activity.completed ? 1 : 0);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Completed Activities',
          data: completed,
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Incomplete Activities',
          data: incomplete,
          borderColor: 'red',
          fill: false,
        }
      ]
    };
  };

  const getHealthData = () => {
    if (!performanceData || !performanceData.healthData) return { labels: [], datasets: [] };

    const dates = performanceData.healthData.map(record => new Date(record.createdAt).toLocaleDateString());
    const weight = performanceData.healthData.map(record => record.weight);
    const height = performanceData.healthData.map(record => record.height);
    const bmi = performanceData.healthData.map(record => record.bmi);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Weight (kg)',
          data: weight,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Height (cm)',
          data: height,
          borderColor: 'orange',
          fill: false,
        },
        {
          label: 'BMI',
          data: bmi,
          borderColor: 'purple',
          fill: false,
        }
      ]
    };
  };

  return (
    <main className="p-4 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-4xl font-bold">Performance</h3>
      </div>
      {user ? (
        performanceData ? (
          <div className="mt-4">
            <h4 className="text-2xl font-semibold">Performance Summary for {formatMonth(currentMonth)}</h4>
            <div className="mt-4 flex justify-between">
              <div className="mb-8">
                <h5 className="text-xl font-semibold">Activities</h5>
                <p><strong>Completed Activities:</strong> {performanceData.completedActivities}</p>
                <p><strong>Incomplete Activities:</strong> {performanceData.incompleteActivities}</p>
                <div className='flex'>
                  <ul>
                      {performanceData.activities && performanceData.activities.map(activity => (
                      <li key={activity._id} className="border p-2 mt-2">
                          <h5 className="text-lg font-bold">{activity.activityType}</h5>
                          <p>{activity.description}</p>
                          <p>{new Date(activity.date).toLocaleString()}</p>
                          <p>{activity.completed ? 'Completed' : 'Incomplete'}</p>
                      </li>
                      ))}
                  </ul>
                  <div className='w-140 ml-10'>
                      <Line data={getActivityData()} />
                  </div>
                </div>
              </div>
              <div className="mt-4 mr-40">
                <h5 className="text-xl font-semibold">Health</h5>
                {performanceData.healthData && performanceData.healthData.length > 0 ? (
                  <div className='p-4'>
                    <p><strong>Weight:</strong> {performanceData.healthData[0].weight} kg</p>
                    <p><strong>Height:</strong> {performanceData.healthData[0].height} cm</p>
                    <p><strong>BMI:</strong> {performanceData.healthData[0].bmi}</p>
                    <p><strong>Risk of Sickness:</strong> {performanceData.healthData[0].riskOfSickness}</p>
                    <div className='ml-5 w-120 h-120 mt-5'>
                      <Line data={getHealthData()} />
                    </div>
                  </div>
                ) : (
                  <p>No health data available.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading performance data...</p>
        )
      ) : (
        <p>Please log in to view your performance data.</p>
      )}
    </main>
  );
}