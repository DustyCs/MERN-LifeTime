import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function LifeOverview() {
  const { year } = useParams();
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    fetchOverviewData();
  }, [year]);

  const fetchOverviewData = async () => {
    try {
      const response = await API.get(`/life-overview/${year}`);
      setOverviewData(response.data);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    }
  };

  const formatMonth = (monthString) => {
    return monthString.charAt(0).toUpperCase() + monthString.slice(1);
  };

  const getActivityData = () => {
    if (!overviewData || !overviewData.activities) return { labels: [], datasets: [] };

    const dates = overviewData.activities.map(activity => new Date(activity.date).toLocaleDateString());
    const completed = overviewData.activities.map(activity => activity.completed ? 1 : 0);
    const incomplete = overviewData.activities.map(activity => !activity.completed ? 1 : 0);

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
    if (!overviewData || !overviewData.healthData) return { labels: [], datasets: [] };

    const dates = overviewData.healthData.map(record => new Date(record.createdAt).toLocaleDateString());
    const weight = overviewData.healthData.map(record => record.weight);
    const height = overviewData.healthData.map(record => record.height);
    const bmi = overviewData.healthData.map(record => record.bmi);

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
        <h3 className="text-4xl font-bold">Life Overview for {year}</h3>
      </div>
      {overviewData ? (
        <div className="space-y-8">
          <div>
            <h4 className="text-2xl font-semibold">Schedules and Activities</h4>
            <div className="mt-4">
              <h5 className="text-xl font-semibold">Activities</h5>
              <ul>
                {overviewData.activities.map(activity => (
                  <li key={activity._id} className="border p-2 mt-2">
                    <h5 className="text-lg font-bold">{activity.activityType}</h5>
                    <p>{activity.description}</p>
                    <p>{new Date(activity.date).toLocaleString()}</p>
                    <p>{activity.completed ? 'Completed' : 'Incomplete'}</p>
                  </li>
                ))}
              </ul>
              <Line data={getActivityData()} />
            </div>
            <div className="mt-4">
              <h5 className="text-xl font-semibold">Schedules</h5>
              <ul>
                {overviewData.schedules.map(schedule => (
                  <li key={schedule._id} className="border p-2 mt-2">
                    <h5 className="text-lg font-bold">{schedule.title}</h5>
                    <p>{schedule.description}</p>
                    <p>{new Date(schedule.date).toLocaleString()}</p>
                    <p>{schedule.category}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-semibold">Health</h4>
            <Line data={getHealthData()} />
          </div>
          <div>
            <h4 className="text-2xl font-semibold">Monthly Reviews</h4>
            <ul>
              {overviewData.reviews.map(review => (
                <li key={review._id} className="border p-2 mt-2">
                  <h5 className="text-lg font-bold">{formatMonth(review.month)}</h5>
                  <p><strong>Health:</strong> {review.analysis.health}</p>
                  <p><strong>Exercise:</strong> {review.analysis.exercise}</p>
                  <p><strong>Hobby:</strong> {review.analysis.hobby}</p>
                  <p><strong>Entertainment:</strong> {review.analysis.entertainment}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading overview data...</p>
      )}
    </main>
  );
}