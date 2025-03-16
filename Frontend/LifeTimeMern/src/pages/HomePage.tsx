import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { ScheduleModal } from "../components/modals/ScheduleActivity";
import { ActivityModal } from "../components/modals/ScheduleActivity";

interface Schedule {
  _id: string;
  title: string;
  description?: string;
  date: string;
  category: "Work" | "Fitness" | "Chill" | "Hobby" | "Health" | "Other";
}

interface Activity {
  _id: string;
  activityType: string;
  duration: number;
  distance?: number;
  date: string;
  completed: boolean;
}

interface HealthData {
  previous: number;
  current: number;
}

const Homepage = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);

  useEffect(() => {
    fetchSchedule();
    fetchActivities();
    fetchHealthData();
    fetchAiAnalysis();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get("/api/schedule/current-week");
      
      // Check if the response status is OK (200)
      if (response.status === 200) {
        const data = response.data;
        
        // Check if the response is an array
        if (Array.isArray(data)) {
          setSchedule(data);
        } else {
          console.error("Fetched schedule data is not an array", data);
          setSchedule([]); // Set to empty array if not an array
        }
      } else {
        console.error("Error fetching schedule: Response status", response.status);
        setSchedule([]); // Set to empty array in case of error
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setSchedule([]); // Set to empty array in case of error
    }
  };
  
  const fetchActivities = async () => {
    try {
      const response = await axios.get("/api/activity/current-week");
      
      // Check if the response status is OK (200)
      if (response.status === 200) {
        const data = response.data;
        
        // Check if the response is an array
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error("Fetched activities data is not an array", data);
          setActivities([]); // Set to empty array if not an array
        }
      } else {
        console.error("Error fetching activities: Response status", response.status);
        setActivities([]); // Set to empty array in case of error
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]); // Set to empty array in case of error
    }
  };

  const fetchHealthData = async () => {
    try {
      const { data } = await axios.get("/api/health");
      setHealthData(data);
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  const fetchAiAnalysis = async () => {
    try {
      const month = new Date().toLocaleString("default", { month: "long" });
      const { data } = await axios.get(`/api/review/${month}`);
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="p-4 space-y-6 w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-xl font-bold">Current Week Schedule</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => {
            // Only run filter if `schedule` is an array
            const daySchedule = Array.isArray(schedule) ? schedule.filter((s) => new Date(s.date).toLocaleString("en-US", { weekday: "long" }) === day) : [];
            const dayActivities = Array.isArray(activities) ? activities.filter((a) => new Date(a.date).toLocaleString("en-US", { weekday: "long" }) === day) : [];

            return (
              <Card key={day}>
                <CardContent>
                  <h2 className="font-semibold">{day}</h2>
                  {daySchedule.length > 0 || dayActivities.length > 0 ? (
                    <>
                      {daySchedule.map((s) => (
                        <p key={s._id}>{s.title} - {s.category}</p>
                      ))}
                      {dayActivities.map((a) => (
                        <p key={a._id}>{a.activityType} - {a.duration} mins</p>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500">You're Free - No Schedule or Activities</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="flex space-x-4 mt-4">
            <Button onClick={() => { console.log("Create Schedule clicked"); setScheduleModalOpen(true); }}>Create Schedule</Button>
            <Button onClick={() => { console.log("Create Activity clicked"); setActivityModalOpen(true); }}>Create Activity</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-xl font-bold">Health Status Comparison</h1>
        {healthData && (
          <Line
            data={{
              labels: ["Previous Day", "Today"],
              datasets: [
                {
                  label: "Health Status",
                  data: [healthData.previous, healthData.current],
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            }}
          />
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-xl font-bold">AI Insights</h1>
        <p>{aiAnalysis || "Hey! I'm the AI that will provide insights for your activities!"}</p>
      </motion.div>

      <ScheduleModal isOpen={isScheduleModalOpen} onClose={() => setScheduleModalOpen(false)} onSuccess={fetchSchedule} />
      <ActivityModal isOpen={isActivityModalOpen} onClose={() => setActivityModalOpen(false)} onSuccess={fetchActivities} />
    </div>
  );
};

export default Homepage;