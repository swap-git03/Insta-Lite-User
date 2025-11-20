import "../styles/CommentsModal.css";

function CommentsModal({ post, close }) {
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h3>Comments</h3>
          <button className="close-btn" onClick={close}>×</button>
        </div>

        <div className="modal-comments">
          {post.comments.length === 0 ? (
            <p className="no-comments">No comments yet.</p>
          ) : (
            post.comments.map((c, index) => (
              <div className="comment-item" key={index}>
                <b>@{c.user?.username || "user"}</b> {c.text}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default CommentsModal;
