import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./Component.css";


const BASE_URL = "http://localhost:8080/api/v1/admin";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      setLoading(true);


      const userRes = await fetch(`${BASE_URL}/allUsers`, { headers });
      if (!userRes.ok) throw new Error("Failed to fetch users");

      const usersData = await userRes.json();
      const foundUser = usersData.find((u) => String(u.userId || u.id) === String(id));

      if (!foundUser) {
        setError("User not found");
        return;
      }
      setUser(foundUser);

      const transRes = await fetch(`${BASE_URL}/transactions?userId=${id}`, { headers });

      if (transRes.ok) {
        const transData = await transRes.json();
        setTransactions(Array.isArray(transData) ? transData : []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="loader">Loading User Profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">No user data available.</div>;

  const issuedBooks = transactions.filter(
    (t) => t.status === "ISSUED" || t.status === "OVERDUE"
  );

  return (
    <div className="ud-container">
      <div className="ud-main">
        <div className="ud-navbar">

        </div>

        <div className="ud-top">
          <div className="ud-profile-card">
            <span className="ud-avatar">{user.name ? user.name[0] : "U"}</span>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className="ud-role">{user.role || "USER"}</span>
          </div>

          <div className="ud-issued">

            <h3>Currently Issued</h3>

            <table className="ud-table">

              <thead>

                <tr>

                  <th>Title</th>

                  <th>Transaction ID</th>

                  <th>Issue Date</th>



                </tr>

              </thead>

              <tbody>

                {issuedBooks.length > 0 ? (

                  issuedBooks.map((b) => (

                    <tr key={b.id || b.transactionId}>

                      <td>{b.bookTitle || b.name || "N/A"}</td>

                      <td>{b.transactionId || b.id}</td>

                      <td>{b.issueDate || b.issue}</td>



                    </tr>

                  ))

                ) : (
                  <tr><td colSpan="3">No books currently issued.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ud-transactions">

          <div className="ud-trans-header">

            <h3>Transaction History</h3>

            <button className="ud-btn" onClick={() => window.print()}>Print</button>

          </div>



          <table className="ud-table">

            <thead>

              <tr>

                <th>ID</th>

                <th>Book Name</th>

                <th>Issue Date</th>

                <th>Return Date</th>

                <th>Status</th>

                <th>Fine</th>

              </tr>

            </thead>

            <tbody>

              {transactions.length > 0 ? (

                transactions.map((t) => (

                  <tr key={t.id || t.transactionId}>

                    <td>{t.bookId || "N/A"}</td>

                    <td>{t.bookTitle || t.name || "N/A"}</td>

                    <td>{t.issueDate || t.issue}</td>

                    <td>{t.returnDate || "N/A"}</td>

                    <td>


                      <td>
                        <span className={`ud-status ${t.status === 'ISSUED' || t.status === 'Issued' ? 'issued' :
                          t.status === 'RETURNED' || t.status === 'Returned' ? 'returned' :
                            'returned'
                          }`}>
                          {t.status}
                        </span>
                      </td>


                    </td>

                    <td>₹{t.fine || 0}</td>

                  </tr>

                ))

              ) : (
                <tr><td colSpan="4">No transaction history found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;