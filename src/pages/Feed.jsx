import { useEffect, useState } from "react";
import axios from "axios";
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

  // FETCH FEED
  const fetchFeed = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Feed error:", err);
    }
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(res.data.filter((u) => u._id !== currentUser._id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFeed();
    fetchUsers();
  }, []);

  const toggleLike = async (post) => {
    try {
      await axios.post(
        "http://localhost:5000/api/posts/like",
        { postId: post._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/posts/comment",
        { postId, text },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
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

      {/* SHOW SUGGESTIONS ONLY IF NO POSTS */}
      {posts.length === 0 && (
        <div className="empty-suggest-box">
          <h3>People You May Know</h3>
          {users.map((u) => (
            <div className="suggest-user" key={u._id}>
              <img
                src={u.dp ? `http://localhost:5000/${u.dp}` : "/default.png"}
                className="suggest-dp"
              />
              <span>@{u.username}</span>
              <button onClick={() => navigate(`/profile/${u._id}`)}>
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FEED POSTS */}
      {posts.map((post) => (
        <div className="post-card" key={post._id}>
          <div
            className="post-header"
            onClick={() => navigate(`/profile/${post.user._id}`)}
          >
            <img
              src={
                post.user.dp
                  ? `http://localhost:5000/${post.user.dp}`
                  : "/default.png"
              }
              className="post-dp"
            />
            <span className="post-username">@{post.user.username}</span>
          </div>

          <img
            src={`http://localhost:5000/${post.image}`}
            className="post-image"
          />

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

      {showModal && (
        <CommentsModal post={selectedPost} close={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default Feed;
