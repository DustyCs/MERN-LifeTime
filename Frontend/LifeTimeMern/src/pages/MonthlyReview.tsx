import { useState, useEffect } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';

interface ReviewData {
  health: string;
  exercise: string;
  hobby: string;
  entertainment: string;
}

export default function MonthlyReview() {
  const { month } = useParams<{ month: string }>();
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  useEffect(() => {
    fetchReviewData();
  }, [month]);

  const fetchReviewData = async () => {
    try {
      const response = await API.get(`/review/detailed/${month}`);
      setReviewData(response.data);
    } catch (error) {
      console.error('Error fetching review data:', error);
    }
  };

  const formatMonth = (monthString: string) => {
    const date = new Date();
    const year = date.getFullYear();
    return `${monthString.charAt(0).toUpperCase() + monthString.slice(1)} ${year}`;
  };

  return (
    <main className="p-4 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-4xl font-bold">Monthly Review for {formatMonth(month || '')}</h3>
      </div>
      {reviewData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">🩺 Health Advice</h4>
            <p className="text-gray-700">{reviewData.health}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">💪 Exercise Recommendation</h4>
            <p className="text-gray-700">{reviewData.exercise}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">🎨 Hobby Suggestion</h4>
            <p className="text-gray-700">{reviewData.hobby}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold">🎬 Entertainment Suggestion</h4>
            <p className="text-gray-700">{reviewData.entertainment}</p>
          </div>
        </div>
      ) : (
        <p>Loading review data...</p>
      )}
    </main>
  );
}