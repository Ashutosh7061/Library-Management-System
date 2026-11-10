import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Component.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = "http://localhost:8080/api/v1/admin";

const AdminBooks = () => {
  const [search, setSearch] = useState("");
  const [booksData, setBooksData] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    issued: "",
    noOfBooks: "",
    status: "Available",
    description: "",
    genre: "",
  });

  //  FETCH BOOKS
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBooksData(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBooksData([]);
    }
  };

  //  SEARCH LOGIC
  const filteredBooks = (booksData || []).filter((book) => {
    const searchText = search.toLowerCase();
    return (
      String(book.bookId || "").toLowerCase().includes(searchText) ||
      String(book.title || "").toLowerCase().includes(searchText) ||
      String(book.author || "").toLowerCase().includes(searchText)
    );
  });

  //  VIEW
  const handleView = (book) => navigate(`/bookdetail/${book.bookId}`);

  //  EDIT MODE INITIALIZATION
  const handleEdit = (book) => {
    setIsEditMode(true);
    setCurrentBookId(book.bookId);
    setShowModal(true);

    setNewBook({
      title: book.title || "",
      author: book.author || "",
      price: book.price || "",
      issued: String(book.issued),
      noOfBooks: String(book.noOfBooks),
      status: book.status || "Available",
      description: book.description || "",
      genre: book.genre || "",
    });
  };

  //  DELETE
  const handleDelete = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      const response = await fetch(`${BASE_URL}/delete/${book.bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        fetchBooks();
      } else {
        alert("Delete failed: The server rejected the request.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error: Could not reach the server.");
    }
  };

  //  FORM RESET
  const resetForm = () => {
    setShowModal(false);
    setIsEditMode(false);
    setCurrentBookId(null);
    setNewBook({
      title: "",
      author: "",
      price: "",
      issued: "",
      noOfBooks: "",
      status: "Available",
      description: "",
      genre: "",
    });
  };

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  //  ADD / UPDATE SUBMISSION
  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) {
      alert("Title and Author are required");
      return;
    }

    try {

      const payload = {
        title: newBook.title,
        author: newBook.author,
        price: parseFloat(newBook.price) || 0.0,
        issued: parseInt(newBook.issued),
        noOfBooks: parseInt(newBook.noOfBooks),
        status: newBook.status,
        description: newBook.description,
        genre: newBook.genre,
      };

      if (isEditMode) {
        payload.bookId = currentBookId;
      }

      const url = isEditMode
        ? `${BASE_URL}/${currentBookId}`
        : `${BASE_URL}/addBook`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchBooks();
        resetForm();
      } else {

        const contentType = response.headers.get("content-type");
        let errorMsg = "Failed to save book.";
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMsg = errData.message || errorMsg;
          console.error("Server Error:", errData);
        } else {
          errorMsg = await response.text();
        }
        alert(`Error (${response.status}): ${errorMsg}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="ab-container">
      <div className="ab-main">
        {/* TOPBAR */}
        <div className="ab-topbar">
          <input
            type="text"
            placeholder="Search books..."
            className="ab-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="ab-add-btn" onClick={() => { setIsEditMode(false); setShowModal(true); }}>
            + Add Book
          </button>
        </div>

        {/* TABLE */}
        <div className="ab-table-container">
          <table className="ab-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Issued</th>
                <th>Copies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.bookId || Math.random()}>
                    <td>{book.bookId || "-"}</td>
                    <td>{book.title || "-"}</td>
                    <td>{book.author || "-"}</td>
                    <td>₹{book.price || "0"}</td>
                    <td>{book.issued ?? 0}</td>
                    <td>{book.noOfBooks ?? 0}</td>
                    <td>
                      {(() => {
                        const isAvailable = (book.noOfBooks || 0) > (book.issued || 0);
                        const displayStatus = isAvailable ? "Available" : "Unavailable";
                        return (
                          <span className={`ab-status ${displayStatus.toLowerCase()}`}>
                            {displayStatus}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="ab-actions">
                      <FaEye onClick={() => handleView(book)} />
                      <FaEdit onClick={() => handleEdit(book)} />
                      <FaTrash onClick={() => handleDelete(book)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>No books found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="ab-modal">
            <div className="ab-modal-content">
              <h3>{isEditMode ? "Edit Book" : "Add Book"}</h3>

              {isEditMode && (
                <input
                  name="id"
                  value={currentBookId || ""}
                  disabled
                  readOnly
                />
              )}

              <input name="title" placeholder="Title" value={newBook.title} onChange={handleChange} />
              <input name="author" placeholder="Author" value={newBook.author} onChange={handleChange} />
              <input name="price" placeholder="Price" value={newBook.price} onChange={handleChange} />
              <input name="issued" placeholder="Issued Count" value={newBook.issued} onChange={handleChange} />
              <input name="noOfBooks" placeholder="Total Copies" value={newBook.noOfBooks} onChange={handleChange} />

              <select name="status" value={newBook.status} onChange={handleChange}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <textarea name="description" placeholder="Description" value={newBook.description} onChange={handleChange} />

              <select name="genre" value={newBook.genre} onChange={handleChange}>
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
              </select>

              <div className="ab-modal-actions">
                <button onClick={handleAddBook}>{isEditMode ? "Update" : "Add"}</button>
                <button onClick={resetForm}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;