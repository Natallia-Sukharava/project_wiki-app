import { Link } from "react-router-dom";
import "../../styles/Navbar.css";

function Navbar({ onCreateWorkspace }) {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Wiki App</h1>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/new">New Article</Link>

        <span className="navbar-link" onClick={onCreateWorkspace}>
          New Workspace
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
