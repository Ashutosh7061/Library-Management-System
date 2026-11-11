import React, { useState, useMemo, useEffect } from "react";
import "./User.css";

const BASE_URL = "http://localhost:8080/api/v1/user";

const MyTransactionsPage = () => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showPopup = (message, type = "success") => {
    setPopup({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setPopup({
        show: false,
        type: "success",
        message: "",
      });
    }, 3000);
  };


  const [appliedStatus, setAppliedStatus] = useState("All");


  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const jwtToken = localStorage.getItem("jwt");
        if (!jwtToken) {
          console.error("No JWT found in local storage");
          return;
        }

        let url = `${BASE_URL}/transaction`;
        if (appliedStatus !== "All" && appliedStatus !== "OVERDUE") {
          url += `?status=${appliedStatus.toUpperCase()}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {

        console.error("Error fetching transactions:", error);
        showPopup("Unable to fetch transactions", "error");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [appliedStatus]);


  const getComputedStatus = (item) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    if (item.status === "ISSUED" && item.returnDate < today) {
      return "OVERDUE";
    }
    return item.status;
  };


  const filteredData = useMemo(() => {
    return transactions.filter((item) => {

      const currentStatus = getComputedStatus(item);


      const bookName = item.bookTitle?.toLowerCase() || "";
      const transactionId = item.transactionId?.toString() || "";
      const searchTerm = search.toLowerCase();


      const matchesSearch = bookName.includes(searchTerm) || transactionId.includes(searchTerm);

      const matchesStatus = appliedStatus === "All" || currentStatus === appliedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, appliedStatus, transactions]);

  return (
    <div className="lm-container">
      <div className="lm-main">

        <div className="lm-hero">
          <h1>Transaction Center</h1>

          <p>
            Track all your issued, returned, and overdue books in one modern dashboard.
            Manage your reading activity, monitor return deadlines, and keep your
            library records organized with a smooth digital experience.
          </p>
        </div>

        <div className="lm-stats">

          <div className="lm-stat-card">
            <h3>Total Transactions</h3>
            <h2>{transactions.length}</h2>
            <span>Library activities recorded</span>
          </div>

          <div className="lm-stat-card">
            <h3>Issued Books</h3>
            <h2>
              {
                transactions.filter(
                  (t) => getComputedStatus(t) === "ISSUED"
                ).length
              }
            </h2>
            <span>Currently borrowed</span>
          </div>

          <div className="lm-stat-card">
            <h3>Returned Books</h3>
            <h2>
              {
                transactions.filter(
                  (t) => getComputedStatus(t) === "RETURNED"
                ).length
              }
            </h2>
            <span>Completed successfully</span>
          </div>

          <div className="lm-stat-card">
            <h3>Overdue Books</h3>
            <h2>
              {
                transactions.filter(
                  (t) => getComputedStatus(t) === "OVERDUE"
                ).length
              }
            </h2>
            <span>Need immediate attention</span>
          </div>

        </div>


        {/* Filters Row */}
        <div className="lm-filters">
          <input
            type="text"
            placeholder="Search by book or ID..."
            className="lm-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={appliedStatus}
            onChange={(e) => setAppliedStatus(e.target.value)}
            className="lm-select"
          >
            <option value="All">All Status</option>
            <option value="ISSUED">Issued</option>
            <option value="RETURNED">Returned</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <button className="lm-print-btn" onClick={() => window.print()}>
            Print Report
          </button>
        </div>

        {/* Table Section */}
        <div className="lm-table-wrapper">
          {loading ? (
            <div className="lm-loader">Loading transactions...</div>
          ) : (
            <table className="lm-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Book Title</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const statusValue = getComputedStatus(item);
                    return (
                      <tr key={item.id}>
                        <td>{item.transactionId}</td>
                        <td className="lm-book-name">{item.bookTitle}</td>
                        <td>{item.issueDate}</td>
                        <td>{item.returnDate}</td>
                        <td>
                          <span className={`lm-badge status-${statusValue.toLowerCase()}`}>
                            {statusValue}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="lm-empty">No transactions found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type}`}>

            <div className="popup-icon">
              {popup.type === "success" ? "✓" : "!"}
            </div>

            <div className="popup-content">
              <h4>
                {popup.type === "success"
                  ? "Success"
                  : "Error"}
              </h4>

              <p>{popup.message}</p>
            </div>

            <button
              className="popup-close"
              onClick={() =>
                setPopup({
                  show: false,
                  type: "success",
                  message: "",
                })
              }
            >
              ×
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyTransactionsPage;