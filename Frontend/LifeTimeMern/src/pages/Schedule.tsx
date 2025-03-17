import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import API from '../api/api';
import { ScheduleModal } from '../components/modals/ScheduleActivity';
import Button from '../components/ui/Button';

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [feedback, setFeedback] = useState('Your schedules are clear, create a new one!');

  useEffect(() => {
    fetchSchedules();
  }, [currentDate]);

  const fetchSchedules = async () => {
    try {
      const response = await API.get('/schedules/current-month'); // 🔥 Updated to the correct endpoint
      console.log("📅 Fetched schedules:", response.data);

      if (response.data.length === 0) {
        setFeedback("Your schedules are clear, create a new one!"); // No schedules message
      } else {
        const schedules = response.data.map(schedule => ({
          title: schedule.title,
          start: new Date(schedule.date),
          end: new Date(schedule.date),
          allDay: true,
        }));
        setEvents(schedules);
        generateFeedback(response.data); // 🔥 Auto-fetch feedback when schedules update
      }
    } catch (error) {
      console.error('❌ Error fetching schedules:', error);
    }
  };

  const generateFeedback = async (scheduleData) => {
    try {
      const response = await API.post('/gemini', { prompt: 'Give feedback about my schedules for the month.', data: scheduleData });
      setFeedback(response.data || "Your schedules are clear, create a new one!");
    } catch (error) {
      console.error('❌ Error generating feedback:', error);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'months').toDate());
  };

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
  };

  return (
    <main className="p-4 w-[70%] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-4xl font-bold">Schedule</h3>
        <Button onClick={() => setModalOpen(true)}>Create Schedule</Button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        date={currentDate}
        onNavigate={date => setCurrentDate(date)}
      />
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrevMonth}>Previous Month</Button>
        <Button onClick={handleNextMonth}>Next Month</Button>
      </div>
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">📢 AI Feedback</h4>
        <p className="mt-2">{feedback}</p>
      </div>
      <ScheduleModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchSchedules} />
    </main>
  );
}