import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ArticleList from "../components/articles/ArticleList";
import { getArticles } from "../api/articles";
import { toast } from "react-toastify";
import "../styles/App.css";
import "../styles/ArticleList.css";
import "../styles/DeleteConfirmToast.css";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchArticles = useCallback(async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error("Error loading articles:", err);
      toast.error("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles, location.pathname]);

  if (loading) {
    return <p className="loading-text">Loading articles...</p>;
  }

  return (
    <div className="home-container">
      <h2 className="page-title">All Articles</h2>
      {articles.length > 0 ? (
        <ArticleList articles={articles} refreshArticles={fetchArticles} />
      ) : (
        <p className="empty-message">No articles yet. Create one!</p>
      )}
    </div>
  );
}

export default HomePage;
