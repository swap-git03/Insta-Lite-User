import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import Users from "./pages/Users";
// import CommentsModal from "../components/CommentsModal";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post/:id" element={<SinglePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
