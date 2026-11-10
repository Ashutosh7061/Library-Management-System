import React, { useEffect, useState, useMemo } from "react";
import "./Component.css";
import { FaBook, FaUsers, FaExchangeAlt } from "react-icons/fa";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis
} from "recharts";

const BASE_URL = "http://localhost:8080/api/v1/admin";

const Dashboard = () => {
  const [dash, setDash] = useState({});
  const [allTransactions, setAllTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    };

    // Fetch Dashboard Stats
    fetch(`${BASE_URL}/getDashboard`, { method: "GET", headers })
      .then((res) => res.json())
      .then((data) => setDash(data))
      .catch((err) => console.error("Dashboard fetch error:", err));

    // Fetch Transactions
    fetch(`${BASE_URL}/transactions`, { method: "GET", headers })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {

          const sortedData = [...data].sort((a, b) =>
            new Date(b.issueDate || 0) - new Date(a.issueDate || 0)
          );

          setAllTransactions(data);
          setRecentTransactions(sortedData.slice(0, 5));
        }
      })
      .catch((err) => console.error("Transaction fetch error:", err));
  }, []);


  const chartData = useMemo(() => {
    // Generate last 7 days labels
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: d.toISOString().split("T")[0],
        count: 0,
      });
    }

    // Count transactions per day
    allTransactions.forEach((trx) => {
      if (trx.issueDate) {
        const trxDate = new Date(trx.issueDate).toISOString().split("T")[0];
        const dayEntry = days.find((d) => d.fullDate === trxDate);
        if (dayEntry) dayEntry.count += 1;
      }
    });

    return days;
  }, [allTransactions]);

  const pieData = [
    { name: "Issued", value: Number(dash.totalIssuedBook) || 0 },
    { name: "Available", value: Number(dash.availableBook) || 0 },
  ];

  const COLORS = ["#fe0000", "#00C49F"];

  return (
    <div className="dashboard-ad">
      <div className="main-ad">
        <div className="topbar-ad">
          <input type="text" placeholder="Search..." className="search-ad" />
          <div className="profile-ad">Admin Panel</div>
        </div>

        <div className="cards-ad">
          <div className="card-ad"><FaBook /><div><p>Total Books</p><h2>{dash.totalBook || 0}</h2></div></div>
          <div className="card-ad"><FaUsers /><div><p>Total Users</p><h2>{dash.totalUser || 0}</h2></div></div>
          <div className="card-ad"><FaExchangeAlt /><div><p>Issued Books</p><h2>{dash.totalIssuedBook || 0}</h2></div></div>
          <div className="card-ad"><FaBook /><div><p>Available Books</p><h2>{dash.availableBook || 0}</h2></div></div>
        </div>

        <div className="charts-ad">

          <div className="chart-box-ad large-ad">
            <h3>Usage Overview (Last 7 Days)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="95%" height="100%">
                <AreaChart data={chartData} margin={{ top: 25, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="dateLabel" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#007bff"
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    name="Books Issued"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box-ad small-ad">
            <h3>Inventory Distribution</h3>
            <ResponsiveContainer width="100%" aspect={1}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-section-ad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Recent Activity (Last 5)</h3>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Updated Just Now</span>
          </div>
          <table className="table-ad">
            <thead>
              <tr>
                <th>User</th>
                <th>Book Title</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((trx) => (
                  <tr key={trx.transactionId}>
                    <td>{trx.userName || trx.userId || "Guest"}</td>
                    <td>{trx.bookTitle}</td>
                    <td>
                      <span className={`status-pill-ad ${trx.status.toLowerCase()}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td>{trx.issueDate ? new Date(trx.issueDate).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: "center" }}>No recent transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;