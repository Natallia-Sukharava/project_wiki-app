import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

export default function Navbar({ onCreateWorkspace }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <h1 className="navbar-logo">Wiki App</h1>

      <nav className="navbar-links">

  {!token && (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  )}

  {token && (
    <>
      <Link to="/">Home</Link>
      <Link to="/new">New Article</Link>
      <span className="navbar-link" onClick={onCreateWorkspace}>
        New Workspace
      </span>

      <span className="user-info">
        Logged in as: <b>{user?.email}</b>
      </span>

      <span className="navbar-link logout-link" onClick={handleLogout}>
        Logout
      </span>
    </>
  )}
</nav>

    </header>
  );
}
