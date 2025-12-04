import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleById, createComment, deleteComment } from "../api/articles";
import { toast } from "react-toastify";

import ArticleView from "../components/articles/ArticleView";
import AttachmentsSection from "../components/AttachmentsSection";

function ArticlePage() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
        setComments(data.comments || []);
      } catch (err) {
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
  
    try {
      const newComment = await createComment(id, commentText);
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
  
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };  

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };  

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found</p>;

  return (
    <div className="page">
      <AttachmentsSection articleId={id} />

      <ArticleView article={article} />

      <section className="comments-section">
        <h3>Comments</h3>

        {comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((c) => (
              <li key={c.id} className="comment-item">
                <span>{c.content}</span>
                <button className="delete-btn" onClick={() => handleDeleteComment(c.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}

        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button className="btn primary" type="submit">
            Add comment
          </button>
        </form>
      </section>
    </div>
  );
}

export default ArticlePage;