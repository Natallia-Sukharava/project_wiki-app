import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById, getWorkspaces, updateArticle } from "../api/articles";
import { toast } from "react-toastify";
import ArticleForm from "../components/articles/ArticleForm";

function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const articleData = await getArticleById(id);
        const ws = await getWorkspaces();
        setArticle(articleData);
        setWorkspaces(ws);
      } catch (err) {
        toast.error("Failed to load article");
        navigate("/");
      }
    })();
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await updateArticle(id, data);
      toast.success("Article updated");
      navigate(`/article/${id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!article || !workspaces.length) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>Edit Article</h2>
      <ArticleForm
        initialData={article}
        workspaces={workspaces}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

export default EditArticlePage;
