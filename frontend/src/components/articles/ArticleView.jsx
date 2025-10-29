import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById } from "../../api/articles";
import "../../styles/ArticleView.css";

function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await getArticleById(id);
      setArticle(data);
    };
    fetchArticle();
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className="article-view">
      <Link to="/">← Back</Link>
      <h2>{article.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}

export default ArticleView;