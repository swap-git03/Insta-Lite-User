import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();

  // Hide navbar on login/register pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  // Load user
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Scroll-hide navbar states
  const [showNav, setShowNav] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll) {
        // scrolling DOWN → hide navbar
        setShowNav(false);
      } else {
        // scrolling UP → show navbar
        setShowNav(true);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  if (hideNavbar) return null;

  const profileLink = user?._id ? `/profile/${user._id}` : "/profile";

  return (
    <nav className={`nav ${showNav ? "nav-show" : "nav-hide"}`}>
      <div className="nav-left">
        <Link to="/feed">
          <img src="/swapinsta-logo.png" className="nav-logo" alt="logo" />
        </Link>
      </div>

      <div className="nav-center">
        <input type="text" placeholder="Search" className="nav-search" />
      </div>

      <div className="nav-right">
        <Link to="/feed" className="nav-icon">
          <i className="bi bi-house-door" />
        </Link>

        <Link to="/create" className="nav-icon">
          <i className="bi bi-plus-square" />
        </Link>

        <Link to="/users" className="nav-icon">
          <i className="bi bi-people-fill" />
        </Link>

        <Link to={profileLink} className="nav-icon">
          {user?.dp ? (
            <img
              src={
                user.dp.startsWith("http")
                  ? user.dp
                  : `http://localhost:5000/${user.dp}`
              }
              className="nav-dp"
              alt="dp"
            />
          ) : (
            <i className="bi bi-person-circle" />
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
