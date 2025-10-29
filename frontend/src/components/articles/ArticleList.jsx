import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/ArticleList.css";

function ArticleList() {
  const [articles, setArticles] = useState([]);

  const loadArticles = () => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Error loading articles:", err));
  };

  useEffect(() => {
    loadArticles();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") loadArticles();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!articles.length) {
    return <p>No articles yet. Create one!</p>;
  }

  return (
    <ul className="article-list">
      {articles.map((article) => (
        <li key={article.id}>
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ArticleList;