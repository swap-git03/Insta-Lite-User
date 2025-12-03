/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/Users.css";
import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(res.data);
    } catch (err) {
      console.log("Users error:", err);
    }
  };

  const followUser = async (id) => {
    try {
      await API.put(`/users/follow/${id}`, {});
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowUser = async (id) => {
    try {
      await API.put(`/users/unfollow/${id}`, {});
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // ✔ FINAL CORRECT VERSION
  const fileURL = (path) => {
    if (!path) return "/default.png";          // fallback
    if (path.startsWith("http")) return path;  // Cloudinary URLs
  
    return `https://swap-insta-backend.onrender.com${path}`;   // local uploads
  };
  

  return (
    <div className="users-wrapper">
      <div className="users-container">

        <div className="users-grid">
          {users.map((u) => (
            <div className="user-card" key={u._id}>
              <div className="user-left">
                <img
                  src={fileURL(u.dp)}
                  className="user-dp"
                  alt="dp"
                />

                <div>
                  <p className="u-name">{u.username}</p>
                  <p className="u-email">{u.email}</p>
                </div>
              </div>

              <div className="user-right">
                {u.followers.includes(currentUser._id) ? (
                  <button
                    className="unfollow-btn"
                    onClick={() => unfollowUser(u._id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="follow-btn"
                    onClick={() => followUser(u._id)}
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Users;
