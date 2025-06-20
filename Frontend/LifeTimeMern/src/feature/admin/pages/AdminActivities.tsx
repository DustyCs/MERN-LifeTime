import { useEffect, useState } from "react";
import { getActivities } from "../api";


export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "", date: "", completed: "" });

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = () => {
    getActivities(filters).then((data) => {
      setActivities(data);
    }).catch((error) => {
      console.error('Error fetching activities:', error);
    }).finally(() => {
      setLoading(false);
    })
  }

//   return (
//     <div>
//       <h1>Admin Activities</h1>
//       <ul>
//         {activities.map((activity: any) => (
//           <li key={activity._id}>
//             {activity.activityType} | Date: {activity.date} | Completed: {activity.completed ? "Yes" : "No"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
return (
    <div>
      <h1>Admin Activities</h1>

      <div>
        <input
          type="text"
          placeholder="Type"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
        <select
          value={filters.completed}
          onChange={(e) => setFilters({ ...filters, completed: e.target.value })}
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>
      </div>

      {loading ? (
        <div>Loading activities...</div>
      ) : (
        <ul>
          {activities.map((act) => (
            <li key={act._id}>
              {act.activityType} | {act.date} |{" "}
              {act.completed ? "Completed" : "Incomplete"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// need to handle complete events
// need to handle type
