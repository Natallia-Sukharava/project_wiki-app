import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
        setError("Access denied. Admins only.");
        return;
      }      

      fetch("http://localhost:4000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Access denied");
        }
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch(() => setError("You do not have access to this page."));
  }, []);

  const changeRole = async (userId, role) => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role }),
      });
  
      if (!res.ok) {
        throw new Error();
      }
  
      setError("");
  
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    } catch {
      setError("Failed to update user role.");
    }
  };  

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>User Management</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Change role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.role === "admin" ? (
                    <button onClick={() => changeRole(u.id, "user")}>
                      Make user
                    </button>
                  ) : (
                    <button onClick={() => changeRole(u.id, "admin")}>
                      Make admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
