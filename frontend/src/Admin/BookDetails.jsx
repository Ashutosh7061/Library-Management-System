import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Component.css";

const ADMIN_BASE_URL = "http://localhost:8080/api/v1/admin";
const USER_BASE_URL = "http://localhost:8080/api/v1/user";

const LBP = () => {
  const { id } = useParams();


  const [bookdetail, setBooksDetail] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json"
  };

  const fetchData = async () => {
    try {
      // Fetch Book Details
      const bookRes = await fetch(`${ADMIN_BASE_URL}/all`, { headers });
      const allBooks = await bookRes.json();
      const foundBook = allBooks.find((b) => String(b.bookId) === String(id));
      setBooksDetail(foundBook);

      // Fetch User List
      const userRes = await fetch(`${ADMIN_BASE_URL}/allUsers`, { headers });
      if (userRes.ok) {
        const users = await userRes.json();
        setAllUsers(users);
      }

      // Fetch Transactions
      const transRes = await fetch(`${ADMIN_BASE_URL}/transactions`, { headers });
      if (transRes.ok) {
        const data = await transRes.json();


        const rawTransactions = Array.isArray(data)
          ? data
          : (data.recentTransactions || []);


        const filtered = rawTransactions.filter(t => {
          const tBookId = t.bookId || (t.book && t.book.bookId);
          return String(tBookId) === String(id);
        });

        setTransactions(filtered);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAction = async (type) => {
    const targetUserId = prompt(`Enter User ID to ${type}:`);
    if (!targetUserId) return;


    const userExists = allUsers.some(u => String(u.userId || u.id) === String(targetUserId));
    if (!userExists) {
      alert(`Error: User ID ${targetUserId} not found.`);
      return;
    }

    try {

      const url = `${USER_BASE_URL}/${type}?bookId=${id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: headers
      });

      const message = await response.text();


      alert(`Server says: ${message}`);
      fetchData();

    } catch (err) {
      alert("Connection failed.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bookdetail) return <div>Book not found.</div>;

  return (
    <div className="lbp-wrapper open">
      <div className="lbp-main">
        <div className="lbp-navbar">
          <input className="lbp-search" placeholder="Search..." />
          <div className="lbp-user">System Admin</div>
        </div>

        <div className="lbp-top-card">
          <div className="lbp-book-img-box">
            <div className="lbp-book-img">📖</div>
            <div className="lbp-isbn">Book ID: {bookdetail.bookId}</div>
          </div>

          <div className="lbp-book-info">
            <h1>{bookdetail.title}</h1>
            <p><strong>{bookdetail.author}</strong></p>

            <div className="lbp-meta">
              <div>Stock: <span>{bookdetail.noOfBooks} Available</span></div>
            </div>

            <div className="lbp-actions">
              <button className="issue" onClick={() => handleAction("issue")}>
                Issue to User ID +
              </button>
              <button className="return" onClick={() => handleAction("return")}>
                Return from User ID −
              </button>
            </div>
          </div>
        </div>

        <div className="lbp-history">
          <h2>Transactions for this Book</h2>
          <table>
            <thead>
              <tr>
                <th>Trans. ID</th>
                <th>User / Email</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>

              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t, index) => (
                  <tr key={t.id || index}>
                    <td>{t.transactionId || "N/A"}</td>
                    <td style={{ fontWeight: 'bold', color: '#007bff' }}>
                      {t.userEmail || t.userId || "System Admin"}
                    </td>
                    <td>{t.issueDate}</td>
                    <td>{t.returnDate || "-"} </td>


                    <td>
                      <span className={`lbp-status ${t.status === 'ISSUED' || t.status === 'Issued' ? 'issued' :
                        t.status === 'RETURNED' || t.status === 'Returned' ? 'returned' :
                          'returned'
                        }`}>
                        {t.status}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                    No transaction history found for this book.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LBP;