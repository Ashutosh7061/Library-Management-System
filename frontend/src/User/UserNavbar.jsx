import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const UserNavbar = ({ collapsed, setCollapsed }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
    memberId: "Loading",
    role: "User"
  });

  const menuItems = [

    { name: "Books", path: "/booklist" },
    { name: "My Transaction", path: "/mytransaction" },
    { name: "My Books", path: "/mybook" },
    { name: "Profile", path: "/myprofile" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.warn("No JWT token found, redirecting...");
      navigate("/", { replace: true });
      return;
    }

    try {
      const decodedData = jwtDecode(token);
      const loadedUser = {
        name: decodedData.name || "Unknown User",

      };

      setUser(loadedUser);

    } catch (error) {
      console.error("Invalid token format:", error);

      localStorage.removeItem("jwt");
      navigate("/", { replace: true });
    }
  }, [navigate]);


  useEffect(() => {
    setCollapsed(true);
  }, [setCollapsed]);


  const handleItemClick = (name, path) => {
    setActiveItem(name);
    navigate(path);


    setCollapsed(true);
  };

  return (
    <>

      <aside className={`user-sidebar ${collapsed ? "collapsed" : "open"}`}>
        <div className="user-sidebar-top">
          <span className="logo">PUSTAKALYA</span>

          <button
            className="user-toggle-btn"
            onClick={() => setCollapsed(true)}
          >
            ✕
          </button>
        </div>

        <nav className="user-sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`user-menu-item ${activeItem === item.name ? "active" : ""
                }`}
              onClick={() => handleItemClick(item.name, item.path)}
            >
              {item.name}
            </div>
          ))}
        </nav>
        <div className="user-profile-card">

          <div className="user-profile-icon">
            👤
          </div>

          <div className="user-profile-info">
            <h4>{user.name}</h4>
            <span>Library Member</span>
          </div>

        </div>
      </aside>


      {!collapsed && window.innerWidth < 768 && (
        <div className="user-overlay" onClick={() => setCollapsed(true)} />
      )}


      {collapsed && (
        <button
          className="user-floating-toggle"
          onClick={() => setCollapsed(false)}
        >
          ☰
        </button>

      )}

    </>
  );
};

export default UserNavbar;