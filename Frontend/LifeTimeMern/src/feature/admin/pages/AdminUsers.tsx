import { useEffect, useState } from "react";
import { getUsers } from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setFilteredUsers(data);
    }).catch((error) => {
      console.error('Error fetching users:', error);
    }).finally(() => {
      setLoading(false);
    })
  }, []);

  useEffect(() => {
      const q = query.toLowerCase();
      setFilteredUsers(
        users.filter((user: any) => user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q))
      );
  }, [query, users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {/* {users.map((user: any) => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))} */}
        {
          filteredUsers.map((user: any) => (
            <li key={user._id}>
              {user.name} - {user.email}
            </li>
          ))
        }
      </ul>
    </div>
  );
}
