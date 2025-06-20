import { useEffect, useState } from "react"
import { getOverview } from "../api"

type Overview = {
  totalUsers: number
  totalActivities: number
  totalScheduledEvents: number
  recentSignups: any[]
  activeUsers: number
}

export default function AdminOverview() {
    const [overview, setOverview] = useState<Overview>({
      totalUsers: 0,
      totalActivities: 0,
      totalScheduledEvents: 0,
      recentSignups: [],
      activeUsers: 0
    })

    useEffect(() => {
      try {
        getOverview().then((data) => {
          setOverview(data)
        })
      } catch (error) {
        console.error('Error fetching overview data:', error);
        }

      return () => {}
    }, [])

  return (
    <div>
      <div>
        <nav>
          <ul>
            <li><a href="/admin/overview">Overview</a></li>
            <li><a href="/admin/users">Users</a></li>
            <li><a href="/admin/activities">Activities</a></li>
            <li><a href="/admin/events">Events</a></li>
            <li><a href="/admin/schedules">Schedules</a></li>
            <li><a href="/admin/queries">Queries</a></li>
          </ul>
        </nav>
      </div>
      <h1>Admin Overview</h1>
      <p>Total Users: {overview.totalUsers}</p>
      <p>Total Activities: {overview.totalActivities}</p>
      <p>Total Scheduled Events: {overview.totalScheduledEvents}</p>
      <p>Recent Signups:</p>
      <ul>
        {overview.recentSignups.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.createdAt}
          </li>
        ))}
      </ul>
      <p>Active Users: {overview.activeUsers}</p>
    </div>
  )
}


// add a way to logout user when token expired