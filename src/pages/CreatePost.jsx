import { useState } from "react";
import axios from "axios";
import "../styles/CreatePost.css";

function CreatePost() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post created!");
      window.location.href = "/feed"; // redirect to feed

    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>

      {/* IMAGE PREVIEW */}
      {preview && <img src={preview} className="preview-image" alt="preview" />}

      {/* FILE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
      />

      {/* CAPTION */}
      <textarea
        placeholder="Write a caption..."
        className="caption-input"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      ></textarea>

      <button className="post-btn" onClick={handlePost}>
        Post
      </button>
    </div>
  );
}

export default CreatePost;
