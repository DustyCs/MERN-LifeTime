import { useState, useEffect } from 'react';
import API from '../api/api';
import { ActivityModal } from '../components/modals/ScheduleActivity';
import Button from '../components/ui/Button';

interface Activity {
  _id: string;
  activityType: string;
  description?: string;
  duration: number;
  distance?: number;
  date: string;
  completed: boolean;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [currentMonth]);

  const fetchActivities = async () => {
    try {
      const response = await API.get(`/activities/${currentMonth}`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
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

  const markAsCompleted = async (id: string) => {
    try {
      await API.patch(`/activities/${id}/complete`);
      fetchActivities();
    } catch (error) {
      console.error('Error marking activity as completed:', error);
    }
  };

  const markAsNonCompleted = async (id: string) => {
    try {
      await API.patch(`/activities/${id}/uncomplete`);
      fetchActivities();
    } catch (error) {
      console.error('Error marking activity as non-completed:', error);
    }
  };

  const editActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setModalOpen(true);
  };

  const completedActivities = activities.filter(activity => activity.completed);
  const nonCompletedActivities = activities.filter(activity => !activity.completed);

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <main className="p-4 w-[70%] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-4xl font-bold">Activities</h3>
        <Button onClick={() => setModalOpen(true)}>Create Activity</Button>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrevMonth}>Previous Month</Button>
        <h4 className="text-2xl font-semibold">{formatMonth(currentMonth)}</h4>
        <Button onClick={handleNextMonth}>Next Month</Button>
      </div>
      <div className='flex justify-around'>
        <div className="mt-4">
            <h4 className="text-2xl font-semibold">Completed Activities</h4>
            {completedActivities.length > 0 ? (
            <ul>
                {completedActivities.map(activity => (
                <li key={activity._id} className="border p-2 mt-2">
                    <h5 className="text-lg font-bold">{activity.activityType}</h5>
                    <p>{activity.description}</p>
                    <p>{new Date(activity.date).toLocaleString()}</p>
                    <Button className='m-1' onClick={() => markAsNonCompleted(activity._id)}>Mark as Non-Completed</Button>
                    <Button className='m-1' onClick={() => editActivity(activity)}>Edit</Button>
                </li>
                ))}
            </ul>
            ) : (
            <p>No completed activities for this month.</p>
            )}
        </div>
        <div className="mt-4">
            <h4 className="text-2xl font-semibold">Non-Completed Activities</h4>
            {nonCompletedActivities.length > 0 ? (
            <ul>
                {nonCompletedActivities.map(activity => (
                <li key={activity._id} className="border p-2 mt-2">
                    <h5 className="text-lg font-bold">{activity.activityType}</h5>
                    <p>{activity.description}</p>
                    <p>{new Date(activity.date).toLocaleString()}</p>
                    <Button className='m-1' onClick={() => markAsCompleted(activity._id)}>Mark as Completed</Button>
                    <Button className='m-1' onClick={() => editActivity(activity)}>Edit</Button>
                </li>
                ))}
            </ul>
            ) : (
            <p>No non-completed activities for this month.</p>
            )}
        </div>
      </div>
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingActivity(null);
        }}
        onSuccess={fetchActivities}
        activity={editingActivity}
      />
    </main>
  );
}