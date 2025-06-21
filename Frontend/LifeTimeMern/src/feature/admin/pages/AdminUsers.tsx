import { useEffect, useState } from "react";
import { deleteUser, getUsers, setUserAdmin } from "../api";
import { Spinner } from "../../../components/Spinner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // getUsers(query, page).then((data) => {
    //   setUsers(data.users);
    //   setFilteredUsers(data.users);
    //   setTotalPages(data.totalPages);
    // }).catch((error) => {
    //   console.error('Error fetching users:', error);
    // }).finally(() => {
    //   setLoading(false);
    // })
    fetchUsers();
  }, [page]);

  useEffect(() => {
      const q = query.toLowerCase();
      setFilteredUsers(
        users.filter((user: any) => user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q))
      );
  }, [query, users]);

  const fetchUsers = () => {
    setLoading(true);
    getUsers(query, page).then((data) => {
      setUsers(data.users);
      setFilteredUsers(data.users);
      setTotalPages(data.totalPages);
    }).catch((error) => {
      console.error('Error fetching users:', error);
    }).finally(() => {
      setLoading(false);
    })
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this user?")) {
      deleteUser(id);
      fetchUsers();
    }
  };

  const handleToggleAdmin = async (id: string) => {
    setUserAdmin(id);
    fetchUsers();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>Users</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => { 
          setQuery(e.target.value)
          setPage(1) // reset page when search query changes // seems to like its being overwritten
        }}
      />
        <ul>
          {filteredUsers.map((user: any) => (
              <li key={user._id}>
                {user.name} - {user.email} - {user.isAdmin ? "Admin" : "User"}
                <button onClick={() => handleToggleAdmin(user._id)}>{user.isAdmin ? "Remove Admin" : "Make Admin" }</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </li>
            ))
          }
        </ul>
        <div>
          Page {page} of {totalPages}
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Prev
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </button>
        </div>
    </div>
  );
}
