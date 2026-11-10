import React, { useState, useMemo, useEffect } from "react";
import "./Component.css";

const BASE_URL = "http://localhost:8080/api/v1/admin";

const Transaction = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [trans, setTrans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    const [tempStartDate, setTempStartDate] = useState("");
    const [tempEndDate, setTempEndDate] = useState("");
    const [tempStatus, setTempStatus] = useState("All");


    const [appliedStartDate, setAppliedStartDate] = useState("");
    const [appliedEndDate, setAppliedEndDate] = useState("");
    const [appliedStatus, setAppliedStatus] = useState("All");

    const rowsPerPage = 10;


    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {

                let url = `${BASE_URL}/transactions`;
                if (appliedStatus !== "All") {
                    url += `?status=${appliedStatus.toUpperCase()}`;
                }

                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setTrans(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setTrans([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [appliedStatus]);


    const filteredData = useMemo(() => {
        return trans.filter((item) => {
            if (!item.issueDate) return true;

            const itemDate = new Date(item.issueDate);
            const isWithinDate =
                (!appliedStartDate || new Date(appliedStartDate) <= itemDate) &&
                (!appliedEndDate || new Date(appliedEndDate) >= itemDate);

            return isWithinDate;
        });
    }, [trans, appliedStartDate, appliedEndDate]);


    const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    const handleExport = () => {
        if (filteredData.length === 0) return alert("No data to export");

        const headers = ["ID", "User", "Book", "Issue Date", "Return Date", "Status"];
        const csvRows = [
            headers.join(","),
            ...filteredData.map(t => [
                t.id,
                t.userName || t.userId,
                t.bookTitle || t.book,
                t.issueDate,
                t.returnDate || "N/A",
                t.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvRows], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className={`lms-container ${sidebarOpen ? "" : "lms-collapse"}`}>
            <div className="lms-main">

                <div className="lms-navbar">
                    <input type="text" placeholder="Search..." className="lms-search" />
                    <div className="lms-profile"><span>Admin</span></div>
                </div>


                <div className="lms-filter">
                    <div className="lms-filter-group">
                        <label className="lms-label">Date Range</label>
                        <div className="lms-date-range">
                            <div className="lms-date-box">
                                <span className="lms-date-label">Start Date</span>
                                <input
                                    type="date"
                                    value={tempStartDate}
                                    onChange={(e) => setTempStartDate(e.target.value)}
                                />
                            </div>
                            <span className="lms-date-separator">—</span>
                            <div className="lms-date-box">
                                <span className="lms-date-label">End Date</span>
                                <input
                                    type="date"
                                    value={tempEndDate}
                                    onChange={(e) => setTempEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lms-filter-group">
                        <label className="lms-label">Status</label>
                        <select value={tempStatus} onChange={(e) => setTempStatus(e.target.value)}>
                            <option value="All">All</option>
                            <option value="ISSUED">Issued</option>
                            <option value="RETURNED">Returned</option>
                            <option value="PENDING">Pending</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </div>

                    <button
                        className="lms-btn lms-apply-btn"
                        onClick={() => {
                            setAppliedStartDate(tempStartDate);
                            setAppliedEndDate(tempEndDate);
                            setAppliedStatus(tempStatus);
                            setCurrentPage(1);
                        }}
                    >
                        Apply Filters
                    </button>
                </div>


                <div className="lms-table-container">
                    <div className="lms-table-header">
                        <h2 className="lms-title">Transactions</h2>
                        <button onClick={handleExport} className="lms-btn lms-export-btn">
                            Export Data
                        </button>
                    </div>

                    {loading ? (
                        <div className="lms-loading">Loading transactions...</div>
                    ) : (
                        <table className="lms-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Book</th>
                                    <th>Issue</th>
                                    <th>Return</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((t) => (
                                        <tr key={t.id}>
                                            <td>{t.transactionId}</td>
                                            <td>{t.userName || t.userId}</td>
                                            <td>{t.bookTitle || t.book}</td>
                                            <td>{t.issueDate}</td>
                                            <td>{t.returnDate || "-"}</td>
                                            <td>
                                                <span className={`lms-badge ${t.status?.toLowerCase()}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>No transactions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}


                    <div className="lms-pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        > Prev </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={currentPage === i + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(i + 1)}
                            > {i + 1} </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        > Next </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transaction;