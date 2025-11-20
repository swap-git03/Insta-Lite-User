import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Feed.css";
import CommentsModal from "../components/CommentsModal";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    fetchFeed();
  }, []);

  // LIKE / UNLIKE
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

  // COMMENT
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

  // OPEN COMMENTS MODAL
  const openComments = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeComments = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <div className="feed-wrapper">
      <div className="feed-container">
        {posts?.map((post) => {
          const currentUserId = JSON.parse(localStorage.getItem("user"))._id;
          const isLiked = post.likes.includes(currentUserId);

          return (
            <div className="post-card" key={post._id}>
              
              {/* Header */}
              <div className="post-header">
                <img
                  src={
                    post.user?.dp
                      ? `http://localhost:5000/${post.user.dp}`
                      : "/default.png"
                  }
                  className="post-dp"
                  alt="dp"
                />
                <span className="post-username">@{post.user?.username}</span>
              </div>

              {/* Post Image */}
              <img
                src={`http://localhost:5000/${post.image}`}
                className="post-image"
                alt="post"
              />

              {/* Actions */}
              <div className="post-actions">
                <button
                  className="like-btn"
                  onClick={() => toggleLike(post)}
                >
                  {isLiked ? (
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

              {/* VIEW COMMENTS */}
              {post.comments.length > 0 && (
                <p className="view-comments" onClick={() => openComments(post)}>
                  View all {post.comments.length} comments
                </p>
              )}

              {/* COMMENT INPUT */}
              <div className="comment-box">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="comment-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addComment(post._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* COMMENTS MODAL */}
      {showModal && (
        <CommentsModal post={selectedPost} close={closeComments} />
      )}
    </div>
  );
}

export default Feed;
