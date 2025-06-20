import { useEffect, useState } from "react";
import { getSchedules } from "../api";

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    getSchedules().then((data) => {
      setSchedules(data);
    });
  }, []);

  return (
    <div>
      <h1>Admin Schedules</h1>
      <ul>
        {schedules.map((schedule: any) => (
          <li key={schedule._id}>
            User: {schedule.userId} | Year: {schedule.year} | Month: {schedule.month}
          </li>
        ))}
      </ul>
    </div>
  );
}
