import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";

// Path matches your @RequestMapping("/user")
const BASE_URL = "http://localhost:8080/api/v1/user";

const BL_Books = () => {
  const [BL_search, setBL_search] = useState("");
  const [BL_filter, setBL_filter] = useState("All");
  const [BL_page, setBL_page] = useState(1);
  const [BL_sidebar, setBL_sidebar] = useState(true);
  const [userbook, setUserBook] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const BL_perPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      // Directly setting data as it is a List<Library>
      setUserBook(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      showPopup("Unable to fetch books", "error");
      
      setUserBook([]);
    } finally {
      setLoading(false);
    }
  };

  // FILTER + SEARCH
  const BL_filtered = useMemo(() => {
    return userbook.filter((book) => {
      // Ensure fields exist before calling toLowerCase
      const title = book.title || "";
      const author = book.author || "";
      const id = String(book.bookId || "");
      
      const searchMatch =
        title.toLowerCase().includes(BL_search.toLowerCase()) ||
        id.toLowerCase().includes(BL_search.toLowerCase()) ||
        author.toLowerCase().includes(BL_search.toLowerCase());

      // Adjusting filter logic to match your data status field
      const filterMatch =
        BL_filter === "All" || 
        (BL_filter === "Available" && book.noOfBooks > 0) ||
        (BL_filter === "Out of Stock" && book.noOfBooks <= 0);

      return searchMatch && filterMatch;
    });
  }, [BL_search, BL_filter, userbook]);

  // PAGINATION LOGIC
  const BL_totalPages = Math.ceil(BL_filtered.length / BL_perPage);
  const BL_books = BL_filtered

  if (loading) return <div className="loader">Loading Books...</div>;

  return (

    
    <div className={`BL_container ${BL_sidebar ? "" : "collapsed"}`}>
      <div className="BL_main">
        
        {/* NAVBAR */}
        <div className="BL_topbar">
         
          
        </div>

        {/* HERO SECTION */}
<div className="BL_hero">
  <h1>Discover Your Next Favorite Book 📚</h1>

  <p>
    Explore thousands of books, search by author or title,
    and access your digital library experience with a modern
    interactive dashboard designed for readers.
  </p>
        </div>

        {/* WELCOME NOTE */}

        <div className="BL_welcome">

          <div className="BL_welcome_left">

            <span className="BL_welcome_tag">
              Welcome Back 👋
            </span>

            <h2>
              Hello Reader,
              Explore PUSTAKALYA, Your Library Manager
            </h2>

            <p>
              Discover new books, continue your reading journey,
              and manage your library experience with a modern
              interactive dashboard.
            </p>

          </div>

          <div className="BL_welcome_right">

            <div className="BL_welcome_circle">
              📚
            </div>

          </div>

        </div>

        {/* HEADER */}
        <div className="BL_header">
          <h2>Browse Library</h2>
          <div className="BL_controls">

            <input
              type="text"
              placeholder="Search by title, author or ID..."
              value={BL_search}
              onChange={(e) => {
                setBL_search(e.target.value);
                setBL_page(1);
              }}
            />

            <select
              value={BL_filter}
              onChange={(e) => {
                setBL_filter(e.target.value);
                setBL_page(1);
              }}
            >
              <option value="All">All Books</option>
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

          </div>
        </div>

        {/* BOOK GRID */}
        <div className="BL_grid">
          {BL_books.length > 0 ? (
            BL_books.map((book) => (
              <div 
                className="BL_card" 
                key={book.bookId}
                onClick={() => navigate(`/userbookdetail/${book.bookId}`)}
              >
                <div className="BL_img">📘</div>
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <div className="BL_meta">
                    
                    <span
                    className={`BL_status ${
                        book.noOfBooks > 0 ? "available" : "issued"
                    }`}
                    >
                    {book.noOfBooks > 0 ? "Available" : "Out of Stock"}
                    </span>
                </div>
                <button className="BL_btn">View Details</button>
              </div>
            ))
          ) : (
            <div className="no-results">No books found matching your criteria.</div>
          )}
        </div>

        {/* FOOTER */}
<div className="BL_footer">
  
  <div className="BL_footer_top">

    <div className="BL_footer_brand">
      <h2>📚 PUSTAKALYA</h2>
      <p>
        A modern digital library platform designed to make
        reading, searching, and managing books simple,
        interactive, and enjoyable for everyone.
      </p>
    </div>

    <div className="BL_footer_links">
      <h3>Quick Links</h3>

      <span>Browse Books</span>
      <span>Categories</span>
      <span>Popular Authors</span>
      <span>My Dashboard</span>
    </div>

    <div className="BL_footer_contact">
      <h3>Library Services</h3>

      <span>Book Reservation</span>
      <span>Reading History</span>
      <span>Issue Tracking</span>
      <span>24/7 Digital Access</span>
    </div>

  </div>

  <div className="BL_footer_bottom">
    <p>
      © 2026 PUSTAKALYA • Built for Smart Digital Learning
    </p>
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

export default BL_Books;