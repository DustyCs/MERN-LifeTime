import React, { useState, useEffect } from 'react';
import API from '../api/api';
import Button from '../components/ui/Button';

export default function Performance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  useEffect(() => {
    fetchPerformanceData();
  }, [currentMonth]);

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

  return (
    <main className="p-4 w-[70%] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-4xl font-bold">Performance</h3>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrevMonth}>Previous Month</Button>
        <h4 className="text-2xl font-semibold">{formatMonth(currentMonth)}</h4>
        <Button onClick={handleNextMonth}>Next Month</Button>
      </div>
      {performanceData ? (
        <div className="mt-4">
          <h4 className="text-2xl font-semibold">Performance Summary for {formatMonth(currentMonth)}</h4>
          <div className="mt-4">
            <p><strong>Completed Activities:</strong> {performanceData.completedActivities}</p>
            <p><strong>Incomplete Activities:</strong> {performanceData.incompleteActivities}</p>
            {performanceData.healthData && (
              <>
                <p><strong>Weight:</strong> {performanceData.healthData.weight} kg</p>
                <p><strong>Height:</strong> {performanceData.healthData.height} cm</p>
                <p><strong>BMI:</strong> {performanceData.healthData.bmi}</p>
                <p><strong>Risk of Sickness:</strong> {performanceData.healthData.riskOfSickness}</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Loading performance data...</p>
      )}
    </main>
  );
}