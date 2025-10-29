import { Link } from "react-router-dom";
import "../../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Wiki App</h1>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/new">New Article</Link>
      </div>
    </nav>
  );
}

export default Navbar;