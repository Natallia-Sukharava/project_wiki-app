import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getArticleById,
  createComment,
  deleteComment,
  getArticleVersionsWithCurrent,
  getArticleVersionById,
} from "../api/articles";
import { toast } from "react-toastify";

import ArticleView from "../components/articles/ArticleView";
import AttachmentsSection from "../components/AttachmentsSection";

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const [showVersions, setShowVersions] = useState(false);
  const [versionsData, setVersionsData] = useState(null);
  const [versionsLoading, setVersionsLoading] = useState(false);

  const [selectedVersion, setSelectedVersion] = useState(null);

  // LOAD ARTICLE
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

  // HANDLERS
  const handleToggleVersions = async () => {
    if (showVersions) {
      setShowVersions(false);
      return;
    }

    try {
      setVersionsLoading(true);
      const data = await getArticleVersionsWithCurrent(id);
      setVersionsData(data);
      setShowVersions(true);
    } catch (err) {
      toast.error("Failed to load versions");
    } finally {
      setVersionsLoading(false);
    }
  };

  const handleSelectVersion = async (versionId) => {
    try {
      const version = await getArticleVersionById(versionId);
      setSelectedVersion(version);
      setShowVersions(false);
    } catch (err) {
      toast.error("Failed to load version");
    }
  };

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

  // EARLY RETURNS
  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found</p>;

  // NORMALIZED ARTICLE FOR VIEW
  const articleToDisplay = selectedVersion
    ? {
        id: article.id,
        title: selectedVersion.title,
        content: selectedVersion.content,
        workspaceId: article.workspaceId,
      }
    : article;

  // RENDER
  return (
    <div className="page">
      {/* ACTION BUTTONS */}
      <div className="article-actions">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleToggleVersions}
        >
          Versions
        </button>
      </div>

      {/* READ-ONLY BANNER */}
      {selectedVersion && (
        <div className="version-banner">
          <strong>
            Viewing version {selectedVersion.versionNumber} (read-only)
          </strong>

          <button
            className="btn btn-secondary"
            onClick={() => setSelectedVersion(null)}
          >
            Back to latest
          </button>
        </div>
      )}

      {/* VERSIONS LIST */}
      {showVersions && (
        <section className="versions-section">
          <h3>Versions</h3>

          {versionsLoading && <p>Loading versions...</p>}

          {!versionsLoading && versionsData && (
            <ul className="versions-list">
              {versionsData.versions.map((v) => (
                <li
                  key={v.id}
                  className="version-item"
                  onClick={() => handleSelectVersion(v.id)}
                >
                  Version {v.versionNumber}
                  {v.isLatest && <strong> (current)</strong>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ATTACHMENTS ONLY FOR LATEST */}
      {!selectedVersion && <AttachmentsSection articleId={id} />}

      {/* ARTICLE CONTENT */}
      <ArticleView article={articleToDisplay} />

      {/* COMMENTS ONLY FOR LATEST */}
      {!selectedVersion && (
        <section className="comments-section">
          <h3>Comments</h3>

          {comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map((c) => (
                <li key={c.id} className="comment-item">
                  <span>{c.content}</span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteComment(c.id)}
                  >
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
      )}
    </div>
  );
}

export default ArticlePage;
