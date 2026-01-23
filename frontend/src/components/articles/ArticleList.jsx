import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteArticle } from "../../api/articles";
import { toast } from "react-toastify";
import "../../styles/ArticleList.css";
import "../../styles/DeleteConfirmModal.css";

function ArticleList({
  articles,
  loading,
  search,
  onSearchChange,
  onRunSearch,
  onClearSearch,
}) {
  const [modalId, setModalId] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      toast.success("Article deleted successfully!");
      setModalId(null);
      onClearSearch();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error(error.message || "Failed to delete article.");
    }
  };

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          value={search}
          placeholder="Search articles..."
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onRunSearch();
            }
          }}
          className="search-input"
        />

        <button
          type="button"
          className="search-btn"
          onClick={onRunSearch}
          disabled={loading}
        >
          Search
        </button>

        {search && (
          <button
            type="button"
            className="clear-btn"
            onClick={onClearSearch}
            disabled={loading}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p className="loading-text">Loading articles...</p>
      ) : articles.length === 0 ? (
        <p className="empty-message">No articles found.</p>
      ) : (
        <ul className="article-list">
          {articles.map((article) => (
            <li key={article.id} className="article-item">
              <div className="article-info">
                <Link to={`/article/${article.id}`} className="article-title">
                  {article.title}
                </Link>

                {article.workspaceId && (
                  <span className="article-workspace">
                    {article.workspace?.name}
                  </span>
                )}
              </div>

              <div className="article-actions">
                <Link to={`/edit/${article.id}`} className="edit-btn">
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => setModalId(article.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to delete this article?</p>
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-btn yes"
                onClick={() => handleDelete(modalId)}
              >
                Yes
              </button>

              <button
                type="button"
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
