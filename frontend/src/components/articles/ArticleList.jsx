import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteArticle } from "../../api/articles";
import { toast } from "react-toastify";
import "../../styles/ArticleList.css";
import "../../styles/DeleteConfirmModal.css";

function ArticleList({ articles, refreshArticles }) {
  const [modalId, setModalId] = useState(null); 

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      toast.success("Article deleted successfully!");
      setModalId(null);
      await refreshArticles(); 
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error(error.message || "Failed to delete article.");
    }
  };

  if (!articles || articles.length === 0) {
    return <p>No articles yet. Create one!</p>;
  }

  return (
    <>
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.id} className="article-item">
            <div className="article-info">
              <Link to={`/article/${article.id}`} className="article-title">
                {article.title}
              </Link>

              {article.workspaceId && (
                <span className="article-workspace">
                  Workspace #{article.workspaceId}
                </span>
              )}
            </div>

            <div className="article-actions">
              <Link to={`/edit/${article.id}`} className="edit-btn">
                Edit
              </Link>

              <button
                onClick={() => setModalId(article.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to delete this article?</p>
            <div className="confirm-actions">
              <button
                className="confirm-btn yes"
                onClick={() => handleDelete(modalId)}
              >
                Yes
              </button>

              <button
                className="confirm-btn no"
                onClick={() => setModalId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ArticleList;