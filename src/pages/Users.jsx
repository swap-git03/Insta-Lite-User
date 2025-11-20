import { useEffect, useState } from "react";
import axios from "axios";
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
      const res = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log("Users error:", err);
    }
  };

  const followUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/follow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/unfollow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="users-wrapper">
      <div className="users-container">

        <div className="users-grid">
          {users.map((u) => (
            <div className="user-card" key={u._id}>
              <div className="user-left">
                <img
                  src={u.dp ? `http://localhost:5000/${u.dp}` : "/default.png"}
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
