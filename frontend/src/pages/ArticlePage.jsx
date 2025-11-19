import { useParams } from "react-router-dom";
import ArticleView from "../components/articles/ArticleView";
import AttachmentsSection from "../components/AttachmentsSection";

function ArticlePage() {
  const { id } = useParams();

  return (
    <div className="page">
      <AttachmentsSection articleId={id} />
      <ArticleView />
    </div>
  );
}

export default ArticlePage;
