/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/EditProfile.css";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const stored = localStorage.getItem("user");
  const currentUser = stored ? JSON.parse(stored) : null;
  const userId = currentUser?._id;

const fileURL = (path) => {
  if (!path) return "/default.png";
  if (path.startsWith("http")) return path;
  return `${API.defaults.baseURL.replace("/api", "")}/${path}`;
};


  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    currentUser?.dp ? fileURL(currentUser.dp) : "/default.png"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f)); // temporary preview
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (file) formData.append("dp", file);

      const res = await API.put(`/users/profile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(newUser));

      alert("Profile updated");
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error("Edit profile error:", err?.response || err);
      alert("Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-wrapper">
      <div className="edit-card">
        <h2>Edit Profile</h2>

        <div className="edit-row">
          <img src={preview} alt="dp" className="edit-dp" />
          <div>
            <label className="file-label">
              Choose photo
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
          </div>
        </div>

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="edit-input"
        />

        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="edit-textarea"
        />

        <div className="edit-actions">
          <button className="save-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
