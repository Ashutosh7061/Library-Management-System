import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Component.css";
import { FaBars, FaBell, FaUserCircle, FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = "http://localhost:8080/api/v1/admin";

const UserList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");



  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = (users || []).filter((user) => {
    const searchTerm = search.toLowerCase();


    const name = (user.name || "").toLowerCase();
    const id = String(user.userId || "").toLowerCase();

    return name.includes(searchTerm) || id.includes(searchTerm);
  });
  useEffect(() => {
    fetch(`${BASE_URL}/allUsers`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setUsers(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);

      });
  }, []);

  return (
    <div className={`au-main ${sidebarOpen ? "au-open" : "au-close"}`}>



      <div className="au-content">


        <div className="au-navbar">
          <div className="au-nav-left">

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="au-search"
            />
          </div>

          <div className="au-nav-right">
            <FaBell />
            <div className="au-user">
              <FaUserCircle />
              <span>Admin</span>
            </div>
          </div>
        </div>


        <div className="au-table-container">
          <h2>All Users</h2>

          <table className="au-table">

            <thead>
              <tr>
                <th>User Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.userId} onClick={() => navigate(`/userDetail/${user.userId}`)}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`au-status ${user.noOfBooksTaken !== 0 ? "active" : "inactive"}`}>

                      {user.noOfBooksTaken !== 0 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <FaEdit className="au-action edit" />
                    <FaTrash
                      className="au-action delete"
                      onClick={() => handleDelete(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default UserList;