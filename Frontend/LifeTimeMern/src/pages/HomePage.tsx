import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import API from "../api/api"; // Use the API instance
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
      const response = await API.get("/schedules/current-week"); // Fetch grouped schedules
      const schedules = response.data;
  
      // Extract events from schedules
      const allEvents = schedules.flatMap(schedule =>
        schedule.events.map(event => ({
          ...event,
          date: `${schedule.year}-${schedule.month.toString().padStart(2, "0")}-${event.day.toString().padStart(2, "0")}`, // Format date
        }))
      );
  
      setSchedule(allEvents);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setSchedule([]);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await API.get("/activities/current-week");
      if (Array.isArray(response.data)) {
        setActivities(response.data);
      } else {
        console.error("Fetched activities data is not an array", response.data);
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }
  };

  const fetchHealthData = async () => {
    try {
      const response = await API.get("/health");
      setHealthData(response.data);
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  const fetchAiAnalysis = async () => {
    try {
      const month = new Date().toLocaleString("default", { month: "long" });
      const response = await API.get(`/review/${month}`);
      setAiAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
    }
  };

  return (
    <div className="p-4 space-y-6 w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-xl font-bold">Current Week Schedule</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 7 }).map((_, index) => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - currentDate.getDay() + index);

            const formattedDate = currentDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });

            const formattedISODate = currentDate.toISOString().split("T")[0];
            const daySchedule = schedule.filter((s) => s.date === formattedISODate);
            const dayActivities = activities.filter((a) => a.date.split("T")[0] === formattedISODate);

            return (
              <Card key={formattedISODate}>
                <CardContent>
                  <h2 className="font-semibold">
                    {dayName} - {formattedDate}
                  </h2>
                  {daySchedule.length > 0 || dayActivities.length > 0 ? (
                    <>
                      {daySchedule.map((s) => (
                        <p key={s._id}>
                          {s.title} - {s.category}
                        </p>
                      ))}
                      {dayActivities.map((a) => (
                        <p key={a._id}>
                          {a.activityType} - {a.duration} mins
                        </p>
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
          <Button onClick={() => setScheduleModalOpen(true)}>Create Schedule</Button>
          <Button onClick={() => setActivityModalOpen(true)}>Create Activity</Button>
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
