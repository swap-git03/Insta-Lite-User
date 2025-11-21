import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import Users from "./pages/Users";
import EditProfile from "./pages/EditProfile";
import "./styles/Layout.css";

function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideAll =
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (hideAll) return children;

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const suggestions = JSON.parse(localStorage.getItem("allUsers")) || [];

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar user={currentUser} suggestions={suggestions} />
        <div className="layout-content">{children}</div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/feed" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/users" element={<Users />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
