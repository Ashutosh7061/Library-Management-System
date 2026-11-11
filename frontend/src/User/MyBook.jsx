import React, { useState, useEffect } from "react";
import "./User.css";

const BASE_URL = "http://localhost:8080/api/v1/user";

const MyBook = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);

  const [books, setBooks] = useState([]);


  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showPopup = (message, type = "success") => {
    setPopup({
      show: true,
      type: type,
      message: message,
    });

    setTimeout(() => {
      setPopup({
        show: false,
        type: "success",
        message: "",
      });
    }, 3000);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const jwtToken = localStorage.getItem("jwt");
        if (!jwtToken) {
          console.error("No JWT found in local storage");
          return;
        }

        let url = `${BASE_URL}/transaction?status=ISSUED`;

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
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching Books:", error);
        showPopup("Unable to fetch Books", "error");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleReturn = (id) => {
    const updated = books.filter((b) => b.bookId !== id);
    showPopup("Book returned successfully");
    setBooks(updated);
  };

  return (
    <div className={`lb_container ${collapsed ? "lb_collapsed" : ""}`}>

      <div className="lb_main">

        <div className="lb_header">
          <h1>My Library Collection</h1>
          <p>
            Manage all your currently issued books, track due dates,
            monitor overdue returns, and organize your reading activity
            from one modern dashboard experience.
          </p>
        </div>

        <div className="lb_navbar">
          <input placeholder="Search..." />
        </div>

        {/* Cards */}
        <div className="lb_grid">
          {loading ? (
            <div className="lb_empty">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="lb_empty">No books issued</div>
          ) : (

            books.map((book) => (
              <div key={book.bookId} className="lb_card">
                {book.overdue && (
                  <span className="lb_badge">OVERDUE</span>
                )}

                <div className="lb_cardContent">
                  <div className="lb_img">📘</div>

                  <div className="lb_info">
                    <h3>{book.bookTitle}</h3>
                    <p>{book.bookAuthor}</p>

                    <div className="lb_dates">
                      <div>
                        <span>Issue</span>
                        <p>{book.issueDate}</p>
                      </div>
                      <div>
                        <span>Due</span>
                        <p>{book.dueDate || "-"}</p>
                      </div>
                    </div>

                    <button
                      className="lb_btn"
                      onClick={() => handleReturn(book.bookId)}
                    >
                      Return Book
                    </button>
                  </div>
                </div>
              </div>
            ))
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
              <h4>{popup.type === "success" ? "Success" : "Error"}</h4>
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

export default MyBook;