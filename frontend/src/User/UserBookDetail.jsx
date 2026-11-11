import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./User.css";

const BASE_URL = "http://localhost:8080/api/v1/user";

const UserBookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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


  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  });


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);


      const bookRes = await fetch(`${BASE_URL}/all`, { headers: getHeaders() });
      const booksData = await bookRes.json();
      const foundBook = booksData.find((b) => String(b.bookId) === String(id));
      setBook(foundBook);


      const historyRes = await fetch(`${BASE_URL}/transaction`, { headers: getHeaders() });
      const historyData = await historyRes.json();


      const bookSpecificHistory = historyData.filter(t => String(t.bookId) === String(id));
      setHistory(bookSpecificHistory);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const activeTransaction = history.find(t => t.status === "ISSUED");
  const isIssuedToMe = !!activeTransaction;

  const handleIssueReturn = async () => {
    setProcessing(true);
    const endpoint = isIssuedToMe ? "return" : "issue";

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}?bookId=${id}`, {
        method: "POST",
        headers: getHeaders(),
      });

      if (res.ok) {
        const message = await res.text();
        showPopup(message);
        fetchData();
      } else {
        showPopup("Transaction Failed. ", "error");
      }
    } catch (err) {
      console.error("Transaction error:", err);
    } finally {
      setProcessing(false);
    }
  };


  const handleRenew = async () => {
    if (!activeTransaction) return;
    setProcessing(true);
    try {
      const res = await fetch(`${BASE_URL}/transaction/${activeTransaction.transactionId}/renew`, {
        method: "POST",
        headers: getHeaders(),
      });

      const message = await res.text();
      showPopup(message);

      if (res.ok) fetchData();
    } catch (err) {
      showPopup("Renewal Failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!book) return <div className="error">Book not found.</div>;

  return (
    <div className="bd-container">
      <div className="bd-main">

        <div className="bd-navbar">
          <input className="bd-search" placeholder="Search..." />
          <div className="bd-nav-right">
            <span className="bd-user">Book Details</span>
          </div>
        </div>


        <div className="bd-book-card">
          <div className="bd-book-img">📖</div>
          <div className="bd-info">
            <h2>{book.title}</h2>
            <p>Author: {book.author} <b>||</b> Genre: {book.genre}</p>

            <div className="bd-status">
              <span className="bd-available">Available: {book.noOfBooks}</span>
              <span className="bd-total">Total: {book.noOfBooks}</span>
            </div>

            <button
              className={`bd-action-btn ${isIssuedToMe ? "return-mode" : ""}`}
              onClick={handleIssueReturn}
              disabled={processing || (!isIssuedToMe && book.noOfBooks === 0)}
            >
              {processing ? "Processing..." : isIssuedToMe ? "Return Book" : "Issue Book"}
            </button>
            {isIssuedToMe && (
              <button
                className="bd-renew-btn"
                onClick={handleRenew}
                disabled={processing}
              >
                Renew Book
              </button>
            )}

          </div>
        </div>

        <div className="bd-bottom">
          <div className="bd-description">
            <h3>Description</h3>
            <p>{book.description || "No description provided."}</p>
          </div>

          <div className="bd-history">
            <h3>My History for this Book</h3>
            <table>
              <thead>
                <tr>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((h) => (
                    <tr key={h.transactionId}>
                      <td>{new Date(h.issueDate).toLocaleDateString()}</td>
                      <td>{h.returnDate ? new Date(h.returnDate).toLocaleDateString() : "-"}</td>
                      <td>
                        <span className={`bd-badge ${h.status === "ISSUED" ? "bd-red" : "bd-green"}`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">No previous history.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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

export default UserBookDetailPage;