import "../../styles/ArticleView.css";

function ArticleView({ article }) {
  if (!article) return null;

  return (
    <div className="article-view">
      <h2>{article.title}</h2>

      {article.workspaceId && (
        <p className="article-meta">Workspace #{article.workspaceId}</p>
      )}

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}

export default ArticleView;