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

      // Normalize followers (convert ObjectId → string)
      const cleaned = res.data.map((u) => ({
        ...u,
        followers: u.followers.map((f) => String(f)),
      }));

      // Remove self
      setUsers(cleaned.filter((u) => u._id !== currentUser._id));
    } catch (err) {
      console.log("Users error:", err);
    }
  };

  const followUser = async (id) => {
    try {
      await API.put(`/users/follow/${id}`);

      // Instant UI update
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, followers: [...u.followers, currentUser._id] }
            : u
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowUser = async (id) => {
    try {
      await API.put(`/users/unfollow/${id}`);

      // Instant UI update
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, followers: u.followers.filter((f) => f !== currentUser._id) }
            : u
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // FIXED LOCAL BACKEND DP URL
  const fileURL = (path) => {
    if (!path || path === "null" || path === "undefined")
      return "/default_dp.png";

    const clean = path.startsWith("/") ? path : `/${path}`;
    return `http://localhost:5000${clean}`;
  };

  return (
    <div className="users-wrapper">
      <div className="users-container">

        <div className="users-grid">
          {users.map((u) => (
            <div className="user-card" key={u._id}>
              <div className="user-left">
                <img src={fileURL(u.dp)} className="user-dp" alt="dp" />

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
