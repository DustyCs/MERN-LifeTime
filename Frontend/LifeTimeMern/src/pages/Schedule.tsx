import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, ToolbarProps, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import API from '../api/api';
import { ScheduleModal } from '../components/modals/ScheduleActivity';
import Button from '../components/ui/Button';

const localizer = momentLocalizer(moment);

interface ScheduleEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

interface ScheduleData {
  _id: string;
  title: string;
  date: string;
}

export default function Schedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [feedback, setFeedback] = useState('Your schedules are clear, create a new one!');

  useEffect(() => {
    fetchSchedules();
  }, [currentDate]);

  const fetchSchedules = async () => {
    try {
      const response = await API.get('/schedules/current-month');
      if (response.data.length === 0) {
        setFeedback("Your schedules are clear, create a new one!");
      } else {
        const schedules = response.data.map((schedule: ScheduleData) => ({
          title: schedule.title,
          start: new Date(schedule.date),
          end: new Date(schedule.date),
          allDay: false,
        }));
        setEvents(schedules);
        generateFeedback(response.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const generateFeedback = async (scheduleData: ScheduleData[]) => {
    try {
      const response = await API.post('/gemini', { prompt: 'Give feedback about my schedules for the month.', data: scheduleData });
      setFeedback(response.data || "Your schedules are clear, create a new one!");
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'months').toDate());
  };

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
  };

  const CustomToolbar: React.FC<ToolbarProps<ScheduleEvent, object>> = (toolbar) => {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-btn-group">
          {/* Hide Today, Previous, and Next buttons */}
        </span>
        <span className="rbc-btn-group">
          <button onClick={() => toolbar.onView("month")}>Month</button>
          <button onClick={() => toolbar.onView("week")}>Week</button>
          <button onClick={() => toolbar.onView("day")}>Day</button>
          <button onClick={() => toolbar.onView("agenda")}>Agenda</button>
        </span>
      </div>
    );
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
        components={{
          toolbar: CustomToolbar,
        }}
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