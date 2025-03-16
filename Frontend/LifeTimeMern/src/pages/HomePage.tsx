import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import API from "../api/api"; // Use the API instance
import { ScheduleModal } from "../components/modals/ScheduleActivity";
import { ActivityModal } from "../components/modals/ScheduleActivity";
import HealthModal from "../components/modals/Health";
import axios from "axios"

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
  const [showModal, setShowModal] = useState(false);
  const [aiReviewFetched, setAiReviewFetched] = useState(false);

  useEffect(() => {
    fetchSchedule();
    fetchActivities();
    fetchHealthData();
  }, []); // Runs only once on mount
  
  const checkAndFetchReview = () => {
    if (healthData && activities && schedule) {
      console.log("✅ All data available, fetching AI review...");
      fetchAiAnalysis();
    } else {
      console.log("⏳ Data still missing, retrying...");
      setTimeout(checkAndFetchReview, 500); // Retry after 500ms
    }
  };
  
  useEffect(() => {
    console.log("🔍 Checking conditions for AI Review...");
  
    if (!aiReviewFetched && healthData && activities?.length > 0 && schedule?.length > 0) {
      console.log("✅ All data available, fetching AI review...");
      fetchAiAnalysis();
      setAiReviewFetched(true); // Prevent further calls
    }
  }, [healthData, activities, schedule, aiReviewFetched]);
  
  const fetchSchedule = async () => {
    try {
        const response = await API.get("/schedules/current-week");

        if (!response.data || !response.data.length) {
            console.warn("No schedule data found for the current week.");
            setSchedule([]);
            return;
        }

        // Extract only valid events (skip the first object if it only contains `_id`)
        const schedules = response.data.filter(event => event.title); 

        // Process events: ensure date formatting and validity
        const allEvents = schedules.map(event => {
            if (!event.date) {
                console.warn("Skipping event with missing date:", event);
                return null; // Ignore invalid events
            }

            const parsedDate = new Date(event.date);
            if (isNaN(parsedDate.getTime())) {
                console.warn("Skipping invalid date:", event.date);
                return null; // Ignore events with invalid dates
            }

            return {
                ...event,
                date: parsedDate.toISOString().split("T")[0] // Ensure YYYY-MM-DD format
            };
        }).filter(event => event !== null); // Remove null values

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
      const response = await API.get("/health/recent");
  
      if (!response.data || response.data.length === 0) {
        console.warn("No health data available, setting default values.");
        setHealthData({ previous: 0, current: 0, previousWeight: 0, currentWeight: 0 });
        return;
      }
  
      // Extract the most recent health record
      const latestHealthRecord = response.data[0];
  
      setHealthData({
        previous: latestHealthRecord.bmi ?? 0, // Use BMI
        current: latestHealthRecord.bmi ?? 0, 
        previousWeight: latestHealthRecord.weight ?? 0, // Use Weight
        currentWeight: latestHealthRecord.weight ?? 0,
      });
  
      console.log("Updated Health Data:", latestHealthRecord);
    } catch (error) {
      console.error("Error fetching health data:", error);
      setHealthData({ previous: 0, current: 0, previousWeight: 0, currentWeight: 0 });
    }
  };

  const createAiAnalysis = async (month: string, year: number) => {
    try {
      const healthData = await fetchHealthData();
      const activities = await fetchActivities();
      const scheduleData = await fetchSchedule();
  
      console.log("✅ Final Data Sent to AI Review:", { month, year, activities, scheduleData, healthData });
  
      if (!healthData || healthData.weight === 0 || healthData.height === 0) {
        console.warn("⚠️ Health data is missing, aborting AI review.");
        return;
      }
  
      const response = await API.post(`/review/${month}`, {
        year,
        activities,
        scheduleData,
        healthData,
      });
  
      console.log("📩 AI Review Response:", response.data);
      setAiAnalysis(response.data.analysis);
    } catch (error) {
      console.error("🚨 Error creating AI analysis:", error);
    }
  };  

//   const fetchAiAnalysis = async () => {
//     try {
//       const month = new Date().toLocaleString("default", { month: "long" }).toLowerCase();
//       const year = new Date().getFullYear();
//       const response = await API.get(`/review/${month}`);

//       if (!response.data) {
//         console.warn("No AI review found, attempting to create one...");
//         await createAiAnalysis(month, year);
//         return;
//       }

//       setAiAnalysis(response.data.analysis);
//     } catch (error) {
//       if (error.response?.status === 404) {
//         console.warn("No review exists, generating a new one...");
//         await createAiAnalysis(
//           new Date().toLocaleString("default", { month: "long" }).toLowerCase(),
//           new Date().getFullYear()
//         );
//       } else {
//         console.error("Error fetching AI analysis:", error);
//       }
//     }
//   };

const fetchAiAnalysis = async () => {
    console.log("🚀 Fetching AI Analysis with:", {
      month: "march",
      year: 2025,
      activities,
      scheduleData: schedule,
      healthData,
    });
  
    if (!healthData || !activities || !schedule) {
      console.warn("⚠️ Missing data, aborting AI review.");
      return;
    }
  
    const token = localStorage.getItem("token"); // 👈 Retrieve token (or from context)
    if (!token) {
      console.error("❌ No auth token found, cannot proceed.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/review",
        {
          month: "march",
          year: 2025,
          activities,
          scheduleData: schedule,
          healthData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Attach token
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("✅ AI Review Fetched:", response.data);
    } catch (error) {
      console.error("❌ AI Review Fetch Failed:", error.response?.status, error.response?.data);
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

        {console.log("Health Data Debug:", healthData)}

        {healthData && (healthData.previous !== undefined || healthData.current !== undefined) ? (
            <div className="h-60">
                <Line
                    data={{
                        labels: ["Previous Day", "Today"],
                        datasets: [
                        {
                            label: "BMI",
                            data: [healthData.previous ?? 0, healthData.current ?? 0],
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                        {
                            label: "Weight (kg)",
                            data: [healthData.previousWeight ?? 0, healthData.currentWeight ?? 0],
                            backgroundColor: "rgba(255, 99, 132, 0.2)",
                            borderColor: "rgba(255, 99, 132, 1)",
                            borderWidth: 1,
                        },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                        y: { beginAtZero: true },
                        },
                    }}
                />
            </div>
        ) : (
            <p className="text-gray-500 mt-2">No health data available</p>
        )}

        <button className="mt-4 p-2 bg-blue-500 text-white rounded-md" onClick={() => setShowModal(true)}>
            Log Health Status
        </button>

        {showModal && <HealthModal onClose={() => setShowModal(false)} onSave={fetchHealthData} />}
     </motion.div>

     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-xl font-bold mb-4">AI Insights</h1>

        {aiAnalysis ? (
            <div className="space-y-4">
            {/* Health Section */}
            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">🩺 Health Advice</h2>
                <p className="text-gray-700">{aiAnalysis.health}</p>
            </div>

            {/* Exercise Section */}
            <div className="bg-green-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">💪 Exercise Recommendation</h2>
                <p className="text-gray-700">{aiAnalysis.exercise}</p>
            </div>

            {/* Hobby Section */}
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">🎨 Hobby Suggestion</h2>
                <p className="text-gray-700">{aiAnalysis.hobby}</p>
            </div>

            {/* Entertainment Section */}
            <div className="bg-purple-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">🎬 Entertainment Suggestion</h2>
                <p className="text-gray-700">{aiAnalysis.entertainment}</p>
            </div>
            </div>
        ) : (
            <p>
            Hey! I'm the AI that will provide insights for your activities! I'll give
            you suggestions once I have enough data!
            </p>
        )}
      </motion.div>


      <ScheduleModal isOpen={isScheduleModalOpen} onClose={() => setScheduleModalOpen(false)} onSuccess={fetchSchedule} />
      <ActivityModal isOpen={isActivityModalOpen} onClose={() => setActivityModalOpen(false)} onSuccess={fetchActivities} />
    </div>
  );
};

export default Homepage;
