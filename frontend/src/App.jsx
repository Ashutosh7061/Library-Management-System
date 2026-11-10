import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";

import Login from "./Admin/login";
import HomePage from "./Admin/home";
import Signup from "./Admin/signup";
import Dashboard from "./Admin/adminDash";
import Navbar from "./navbar";
import AdminBooks from "./Admin/AdminBooks";
import LBP from "./Admin/BookDetails";
import UserList from "./Admin/Users";
import UserDetail from "./Admin/UserDetail";
import Transaction from "./Admin/Transaction";
import BL_Books from "./User/UserBook";
import UserNavbar from "./User/UserNavbar";
import UserBookDetailPage from "./User/UserBookDetail";
import MyBook from "./User/MyBook";
import MyTransactionsPage from "./User/MyTransaction";
import UserProfilePage from "./User/UserProfile";
import AdminProfilePage from "./Admin/adminProfile";
import ProtectedRoute from "./ProtectedRoute";

import { Outlet } from "react-router-dom";



const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Navbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className={`main-content ${collapsed ? "expanded" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

const DashboardLayoutUser = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <UserNavbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className={`main-content ${collapsed ? "expanded" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />



        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<AdminBooks />} />
          <Route path="/bookdetail/:id" element={<LBP />} />
          <Route path="/userList" element={<UserList />} />
          <Route path="/userDetail/:id" element={<UserDetail />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/adminProfile" element={<AdminProfilePage />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRole="ROLE_USER">
              <DashboardLayoutUser />
            </ProtectedRoute>
          }
        >
          <Route path="/booklist" element={<BL_Books />} />
          <Route path="/userbookdetail/:id" element={<UserBookDetailPage />} />
          <Route path="/mybook" element={<MyBook />} />
          <Route path="/mytransaction" element={<MyTransactionsPage />} />
          <Route path="/myprofile" element={<UserProfilePage />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;