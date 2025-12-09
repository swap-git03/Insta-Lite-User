/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/Profile.css";

function Profile() {
  const { id } = useParams();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = loggedUser._id === id;

  // LOCAL backend file loader
  const fileURL = (path) => {
    if (!path) return "/default_dp.png";
    const clean = path.replace(/^\//, "");
    return `http://localhost:5000/${clean}`;
  };

  // FETCH PROFILE
  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/profile/${id}`);
      setUser(res.data);

      if (!isOwnProfile) {
        setIsFollowing(res.data.followers.includes(loggedUser._id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH POSTS
  const fetchPosts = async () => {
    try {
      const res = await API.get(`/users/posts/${id}`);  // correct backend route
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [id]);

  // FOLLOW / UNFOLLOW
  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await API.put(`/users/unfollow/${id}`);
        setIsFollowing(false);
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((uid) => uid !== loggedUser._id),
        }));
      } else {
        await API.put(`/users/follow/${id}`);
        setIsFollowing(true);
        setUser((prev) => ({
          ...prev,
          followers: [...prev.followers, loggedUser._id],
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!user)
    return (
      <p style={{ color: "white", marginTop: "90px", textAlign: "center" }}>
        Loading...
      </p>
    );

  return (
    <div className="profile-wrapper">

      {/* HEADER */}
      <div className="profile-header">
        <img
          src={fileURL(user.dp)}
          className="profile-dp"
          alt="dp"
        />

        <div className="profile-info">
          <div className="profile-row">
            <h2>{user.username}</h2>

            {isOwnProfile ? (
              <button className="edit-btn">Edit Profile</button>
            ) : (
              <button className="follow-btn" onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <span><b>{posts.length}</b> posts</span>
            <span><b>{user.followers.length}</b> followers</span>
            <span><b>{user.following.length}</b> following</span>
          </div>

          <p className="profile-bio">{user.bio || "No bio yet."}</p>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="profile-posts-grid">
        {posts.map((p) => (
          <img
            key={p._id}
            src={fileURL(p.image)}
            alt="post"
            className="profile-post"
            onClick={() => (window.location.href = `/post/${p._id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
