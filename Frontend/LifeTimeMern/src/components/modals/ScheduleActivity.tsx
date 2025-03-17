import { useState } from "react";
import API from "../../api/api"; // Import your centralized API instance

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScheduleModal = ({ isOpen, onClose, onSuccess }: ModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Work");

  const handleSubmit = async () => {
    try {
      const formattedDate = new Date(`${date}T${time}`).toISOString();

      await API.post("/schedules", { 
        title, 
        description, 
        date: formattedDate,
        category 
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[999]">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold">Create Schedule</h2>
        <input 
          type="text" placeholder="Title" className="w-full p-2 border mt-2" 
          value={title} onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="text" placeholder="Description" className="w-full p-2 border mt-2" 
          value={description} onChange={(e) => setDescription(e.target.value)} 
        />
        <input 
          type="date" className="w-full p-2 border mt-2" 
          value={date} onChange={(e) => setDate(e.target.value)} 
        />
        <input 
          type="time" className="w-full p-2 border mt-2" 
          value={time} onChange={(e) => setTime(e.target.value)} 
        />
        <select 
          className="w-full p-2 border mt-2" 
          value={category} onChange={(e) => setCategory(e.target.value)}
        >
          <option>Work</option>
          <option>Fitness</option>
          <option>Chill</option>
          <option>Hobby</option>
          <option>Health</option>
          <option>Other</option>
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

export const ActivityModal = ({ isOpen, onClose, onSuccess }: ModalProps) => {
  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    try {
      const formattedDate = new Date(`${date}T${time}`).toISOString();

      await API.post("/activities", { 
        activityType, 
        duration, 
        distance, 
        date: formattedDate 
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold">Create Activity</h2>
        <input 
          type="text" placeholder="Activity Type" className="w-full p-2 border mt-2" 
          value={activityType} onChange={(e) => setActivityType(e.target.value)} 
        />
        <label htmlFor="duration">Duration </label>
        <input 
          type="number" placeholder="Duration (mins)" className="w-full p-2 border mt-2" 
          value={duration} onChange={(e) => setDuration(Number(e.target.value))} 
        />
        <input 
          type="number" placeholder="Distance (optional)" className="w-full p-2 border mt-2" 
          value={distance} onChange={(e) => setDistance(e.target.value)} 
        />
        <input 
          type="date" className="w-full p-2 border mt-2" 
          value={date} onChange={(e) => setDate(e.target.value)} 
        />
        <input 
          type="time" className="w-full p-2 border mt-2" 
          value={time} onChange={(e) => setTime(e.target.value)} 
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};