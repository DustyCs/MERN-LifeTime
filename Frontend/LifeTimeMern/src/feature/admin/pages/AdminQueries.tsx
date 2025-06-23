import { useEffect, useState } from "react";
import { adminQueries } from "../api";


export default function AdminQueries() {
  const [queries, setQueries] = useState<any>(null);

  useEffect(() => {
    adminQueries().then((data) => {
      setQueries(data);
    });
  }, []);

  if (!queries) return <div>Loading queries...</div>;

  return (
    <div>
      <h1>Admin Analytics</h1>

      <h2>Most Missed Activities</h2>
      <ul>
        {queries.mostMissed.map((item: any) => (
          <li key={item._id}>{item._id} - Missed: {item.missed}</li>
        ))}
      </ul>

      <h2>Most Popular Activity Types</h2>
      <ul>
        {queries.mostPopular.map((item: any) => (
          <li key={item._id}>{item._id} - {item.count}</li>
        ))}
      </ul>

      <h2>Most Used Schedule Categories</h2>
      <ul>
        {queries.mostUsedCategory.map((item: any) => (
          <li key={item._id}>{item._id} - {item.count}</li>
        ))}
      </ul>

      <h2>Activity Time Distribution</h2>
      <ul>
        {queries.timeDistribution.map((item: any) => (
          <li key={item._id}>{item._id}:00 - {item.count} activities</li>
        ))}
      </ul>
    </div>
  );
}
