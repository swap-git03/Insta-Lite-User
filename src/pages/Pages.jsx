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

  // FETCH PROFILE USER
  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUser(res.data);
      setIsFollowing(res.data.followers.includes(loggedUser._id));
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH POSTS FROM THAT USER
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [id]);

  const toggleFollow = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${isFollowing ? "unfollow" : "follow"}/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      fetchUser(); 
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <p style={{ color: "white", marginTop: "90px" }}>Loading...</p>;

  return (
    <div className="profile-wrapper">

      {/* TOP SECTION */}
      <div className="profile-header">
        
        <img
          src={user.dp ? `http://localhost:5000/${user.dp}` : "/default.png"}
          className="profile-dp"
          alt="dp"
        />

        <div className="profile-info">

          <div className="profile-row">
            <h2>{user.username}</h2>

            {loggedUser._id === id ? (
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
            src={`http://localhost:5000/${p.image}`}
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
