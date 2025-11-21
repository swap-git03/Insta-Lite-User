/* eslint-disable react-hooks/exhaustive-deps */
 
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const { id } = useParams();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

  // Post menu state
  const [menuPost, setMenuPost] = useState(null);

  const openMenu = (post) => setMenuPost(post);
  const closeMenu = () => setMenuPost(null);

  // ==================
  // FETCH PROFILE
  // ==================
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data);
      setIsFollowing(res.data.followers.includes(loggedUser._id));
    } catch (err) {
      console.log("Profile fetch error:", err);
    }
  };

  // ==================
  // FETCH POSTS
  // ==================
  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/posts/${id}`
      );
      setPosts(res.data);
    } catch (err) {
      console.log("Posts fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [id]);

  // ==================
  // FOLLOW / UNFOLLOW
  // ==================
  const toggleFollow = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${
          isFollowing ? "unfollow" : "follow"
        }/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      fetchUser();
    } catch (err) {
      console.log(err);
    }
  };

  // ==================
  // DELETE POST
  // ==================
  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      closeMenu();
      fetchPosts();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ==================
  // EDIT POST
  // ==================
  const editPost = async (post) => {
    const newCaption = prompt("Enter new caption:", post.caption);
    if (newCaption === null) return;

    try {
      await axios.put(
        `http://localhost:5000/api/posts/${post._id}`,
        { caption: newCaption },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      closeMenu();
      fetchPosts();
    } catch (err) {
      console.log("Edit error:", err);
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

      {/* ====================== */}
      {/* HEADER */}
      {/* ====================== */}
      <div className="profile-header">
        <img
          src={
            user.dp ? `http://localhost:5000/${user.dp}` : "/default.png"
          }
          className="profile-dp"
          alt="dp"
        />

        <div className="profile-info">
          <div className="profile-row">
            <h2>{user.username}</h2>

            {loggedUser._id === id ? (
              <button
                className="edit-btn"
                onClick={() => (window.location.href = "/edit-profile")}
              >
                Edit Profile
              </button>
            ) : (
              <button className="follow-btn" onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
            {loggedUser._id === id && (
               <button className="logout-btn" onClick={logout}>
                  Logout
               </button>
            )}

          <div className="profile-stats">
            <span>
              <b>{posts.length}</b> posts
            </span>
            <span>
              <b>{user.followers.length}</b> followers
            </span>
            <span>
              <b>{user.following.length}</b> following
            </span>
          </div>

          <p className="profile-bio">{user.bio || "No bio yet."}</p>
        </div>
      </div>

      {/* ====================== */}
      {/* POSTS GRID */}
      {/* ====================== */}
      <div className="profile-posts-grid">
        {posts.map((p) => (
          <div className="post-box" key={p._id}>
            <img
              src={`http://localhost:5000/${p.image}`}
              alt="post"
              className="profile-post"
              onClick={() => (window.location.href = `/post/${p._id}`)}
            />

            {loggedUser._id === id && (
              <div className="post-menu-icon" onClick={() => openMenu(p)}>
                ⋮
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ====================== */}
      {/* EDIT/DELETE MENU */}
      {/* ====================== */}
      {menuPost && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="menu-box" onClick={(e) => e.stopPropagation()}>
            <p
              className="menu-item delete"
              onClick={() => deletePost(menuPost._id)}
            >
              Delete Post
            </p>

            <p className="menu-item edit" onClick={() => editPost(menuPost)}>
              Edit Caption
            </p>

            <p className="menu-item cancel" onClick={closeMenu}>
              Cancel
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
