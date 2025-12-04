import { useEffect, useState, useCallback } from "react";
import ArticleList from "../components/articles/ArticleList";
import { getArticles, getWorkspaces, getWorkspaceArticles } from "../api/articles";
import { toast } from "react-toastify";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("all");

  const loadWorkspaces = async () => {
    const ws = await getWorkspaces();
    setWorkspaces(ws);
  };

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];

      if (selectedWorkspace !== "all") {
        data = await getWorkspaceArticles(selectedWorkspace);
      } else {
        data = await getArticles();
      }

      setArticles(data);
    } catch (err) {
      toast.error("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return (
    <div className="home-container">
      <h2 className="page-title">Articles</h2>

      <div className="workspace-filter">
        <label>
          Workspace:
          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
          >
            <option value="all">All</option>
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading articles...</p>
      ) : articles.length > 0 ? (
        <ArticleList articles={articles} refreshArticles={loadArticles} />
      ) : (
        <p>No articles yet.</p>
      )}
    </div>
  );
}

export default HomePage;