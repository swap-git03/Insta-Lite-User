import { useState, useCallback } from "react";
import API from "../api/axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import "../styles/CreatePost.css";

function CreatePost() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [caption, setCaption] = useState("");

  // aspect ratio state
  const [aspect, setAspect] = useState(1); 
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const croppedFile = await getCroppedImg(preview, croppedAreaPixels);

    const formData = new FormData();
    formData.append("image", croppedFile, "cropped.jpg");
    formData.append("caption", caption);

    try {
      await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post created!");
      window.location.href = "/feed";
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>

      {/* Aspect Ratio Buttons */}
      {preview && (
        <div className="aspect-buttons">
          <button
            className={aspect === 1 ? "active" : ""}
            onClick={() => setAspect(1)}
          >
            1:1
          </button>

          <button
            className={aspect === 4 / 5 ? "active" : ""}
            onClick={() => setAspect(4 / 5)}
          >
            4:5
          </button>

          <button
            className={aspect === 16 / 9 ? "active" : ""}
            onClick={() => setAspect(16 / 9)}
          >
            16:9
          </button>
        </div>
      )}

      {preview && (
        <div className="cropper-wrapper">
          <Cropper
            image={preview}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {/* Zoom Slider */}
      {preview && (
        <div className="zoom-slider">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
        </div>
      )}

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
      />

      {/* Caption */}
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
