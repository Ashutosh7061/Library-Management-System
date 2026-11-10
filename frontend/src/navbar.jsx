import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Navbar = ({ collapsed, setCollapsed }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Books", path: "/books" },
    { name: "Users", path: "/userList" },
    { name: "Transaction", path: "/transaction" },
    { name: "Profile", path: "/adminProfile" },
  ];

  useEffect(() => {
    setCollapsed(true);
  }, [setCollapsed]);

  const handleItemClick = (name, path) => {
    setActiveItem(name);
    navigate(path);


    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  return (
    <>

      <aside className={`sidebar ${collapsed ? "collapsed" : "open"}`}>
        <div className="sidebar-top">
          <span className="logo">PUSTAKALYA</span>

          <button
            className="toggle-btn"
            onClick={() => setCollapsed(true)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`menu-item ${activeItem === item.name ? "active" : ""
                }`}
              onClick={() => handleItemClick(item.name, item.path)}
            >
              {item.name}
            </div>
          ))}
        </nav>
      </aside>


      {!collapsed && window.innerWidth < 768 && (
        <div className="overlay" onClick={() => setCollapsed(true)} />
      )}


      {collapsed && (
        <button
          className="floating-toggle"
          onClick={() => setCollapsed(false)}
        >
          ☰
        </button>
      )}
    </>
  );
};

export default Navbar;