import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // npm i react-spinners
import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";
import { getUserDetails } from "../api";


type UserData = {
  user: any;
  activities: any[];
  schedules: any[];
  healthData: any[];
  reviews: any[];
  summary: {
    totalActivities: number;
    completedActivities: number;
    incompleteActivities: number;
    totalSchedules: number;
    lastHealthData?: any;
  };
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (id) {
      getUserDetails(id).then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <ClipLoader color="#333" size={40} />;

  if (!data) return <p>No data</p>;

  // Filter by date
  const filteredActivities = data.activities.filter((a) => {
    if (!fromDate || !toDate) return true;
    const date = new Date(a.date);
    return date >= new Date(fromDate) && date <= new Date(toDate);
  });

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">User Detail - {data.user.name}</h1>

      {/* Summary */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>Total Activities: {data.summary.totalActivities}</p>
        <p>Completed: {data.summary.completedActivities}</p>
        <p>Incomplete: {data.summary.incompleteActivities}</p>
        <p>Total Scheduled Events: {data.summary.totalSchedules}</p>
        {data.summary.lastHealthData && (
          <p>
            Last Health: {data.summary.lastHealthData.bmi} BMI, {data.summary.lastHealthData.weight} kg
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex gap-4 items-center">
        <label>From:</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-1" />
        <label>To:</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-1" />
        <CSVLink data={filteredActivities} filename={`activities-${id}.csv`} className="bg-blue-500 text-white p-2 rounded">
          Export CSV
        </CSVLink>
      </div>

      {/* Activities Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Activities</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Completed</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((act) => (
              <tr key={act._id}>
                <td className="border p-2">{act.activityType}</td>
                <td className="border p-2">{new Date(act.date).toLocaleString()}</td>
                <td className="border p-2">{act.completed ? "✅" : "❌"}</td>
                <td className="border p-2">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() => {
                      toast.success("Activity edited successfully!");
                      // Implement edit (e.g. open modal)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => {
                      if (confirm("Delete this activity?")) {
                        toast.success("Activity deleted successfully!");
                        // Implement delete
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TODO: Do the same tables for Schedules, HealthData, Reviews */}
    </div>
  );
}
