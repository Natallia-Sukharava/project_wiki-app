import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, getWorkspaces } from '../api/articles';
import ArticleForm from '../components/articles/ArticleForm';
import { toast } from 'react-toastify';

function NewArticlePage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const ws = await getWorkspaces();
      setWorkspaces(ws);
    })();
  }, []);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const created = await createArticle(data);
      toast.success('Article created');
      navigate(`/article/${created.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h2>New Article</h2>

      {workspaces.length === 0 ? (
        <div className="empty-message">
          <p>No workspaces found.</p>
          <p>Please create a workspace first to add articles.</p>

          <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
      ) : (
        <ArticleForm
          initialData={null}
          workspaces={workspaces}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default NewArticlePage;
