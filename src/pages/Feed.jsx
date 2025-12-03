/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/Feed.css";
import CommentsModal from "../components/CommentsModal";
import { useNavigate } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  /* ------------------------------
        FIXED IMAGE URL FOR BACKEND
  ------------------------------- */
  const fileURL = (path) => {
    if (!path) return "/default.png";
  
    // Cloudinary URLs (already working)
    if (path.startsWith("http")) return path;
  
    // Render backend static uploads
    return `https://swap-insta-backend.onrender.com/${path}`;
  };
  

  /* ------------------------------
           FETCH FEED
  ------------------------------- */
  const fetchFeed = async () => {
    try {
      const res = await API.get("/posts/feed");
      setPosts(res.data);
    } catch (err) {
      console.error("Feed error:", err);
    }
  };

  /* ------------------------------
        FETCH USERS (Suggestions)
  ------------------------------- */
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(res.data.filter((u) => u._id !== currentUser._id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFeed();
    fetchUsers();
  }, []);

  /* ------------------------------
              LIKE POST
  ------------------------------- */
  const toggleLike = async (post) => {
    try {
      await API.post("/posts/like", { postId: post._id });
      fetchFeed();
    } catch (err) {
      console.log(err);
    }
  };

  /* ------------------------------
           ADD COMMENT
  ------------------------------- */
  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      await API.post("/posts/comment", { postId, text });
      fetchFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const openComments = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="feed-main">

      {/* EMPTY FEED UI */}
      {posts.length === 0 && (
        <div className="ig-empty-feed">
          <div className="ig-icon">
            <i className="bi bi-camera"></i>
          </div>

          <h2>No Posts Yet</h2>
          <p className="ig-subtext">
            When you follow people, you’ll see their posts here.
          </p>

          <h3 className="ig-suggest-title">Suggested For You</h3>

          <div className="ig-suggest-grid">
            {users.map((u) => (
              <div className="ig-suggest-card" key={u._id}>
                <img
                  src={fileURL(u.dp)}
                  className="ig-suggest-img"
                  alt=""
                />
                <p className="ig-suggest-username">@{u.username}</p>

                <button
                  className="ig-view-btn"
                  onClick={() => navigate(`/profile/${u._id}`)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEED POSTS */}
      {posts.map((post) => (
        <div className="post-card" key={post._id}>

          {/* HEADER */}
          <div
            className="post-header"
            onClick={() => navigate(`/profile/${post.user._id}`)}
          >
            <img
              src={fileURL(post.user.dp)}
              className="post-dp"
              alt=""
            />
            <span className="post-username">@{post.user.username}</span>
          </div>

          {/* IMAGE */}
          <div className="post-img-box">
            <img
              src={fileURL(post.image)}
              className="post-image"
              alt=""
            />
          </div>

          {/* ACTIONS */}
          <div className="post-actions">
            <button className="like-btn" onClick={() => toggleLike(post)}>
              {post.likes.includes(currentUser._id) ? (
                <i className="bi bi-heart-fill" style={{ color: "red" }}></i>
              ) : (
                <i className="bi bi-heart"></i>
              )}
            </button>
          </div>

          <p className="post-likes">{post.likes.length} likes</p>

          <p className="post-caption">
            <b>@{post.user.username}</b> {post.caption}
          </p>

          {post.comments.length > 0 && (
            <p className="view-comments" onClick={() => openComments(post)}>
              View all {post.comments.length} comments
            </p>
          )}

          {/* COMMENT INPUT */}
          <div className="comment-box">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(post._id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>

        </div>
      ))}

      {/* COMMENTS MODAL */}
      {showModal && (
        <CommentsModal
          post={selectedPost}
          close={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Feed;
