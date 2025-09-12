import { Link, useLocation } from "react-router-dom";
import "./Navigation.scss";

const Navigation = () => {
  const location = useLocation();
  return (
    <nav className="nav-bar">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        Overview
      </Link>
      <Link
        to="/settings"
        className={location.pathname === "/settings" ? "active" : ""}
      >
        Settings
      </Link>
    </nav>
  );
};

export default Navigation;
