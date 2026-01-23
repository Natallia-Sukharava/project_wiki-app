import { useEffect, useState, useCallback } from "react";
import ArticleList from "../components/articles/ArticleList";
import { getArticles, getWorkspaces, getWorkspaceArticles } from "../api/articles";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("all");
  const location = useLocation();
  const [search, setSearch] = useState("");

  const loadWorkspaces = useCallback(async () => {
    const ws = await getWorkspaces();
    setWorkspaces(ws);
  }, []);

  const loadArticles = useCallback(
    async (searchText) => {
      setLoading(true);
      try {
        let data = [];

        if (selectedWorkspace !== "all") {
          data = await getWorkspaceArticles(selectedWorkspace);

          if (searchText && searchText.trim() !== "") {
            const q = searchText.toLowerCase();
            data = data.filter((a) => {
              const title = (a.title || "").toLowerCase();
              const content = (a.content || "").toLowerCase();
              return title.includes(q) || content.includes(q);
            });
          }
        } else {
          data = await getArticles(searchText || "");
        }

        setArticles(data);
      } catch (err) {
        toast.error("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    },
    [selectedWorkspace]
  );

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  useEffect(() => {
    loadArticles(search);
  }, [selectedWorkspace]); 

  const handleSearchChange = (value) => {
    setSearch(value);

    if (value.trim() === "") {
      loadArticles("");
    }
  };

  const runSearch = () => {
    loadArticles(search);
  };

  const clearSearch = () => {
    setSearch("");
    loadArticles("");
  };
  useEffect(() => {
    if (location.state?.reset) {
      clearSearch();
    }
  }, [location.state]);
  
  useEffect(() => {
    const handleHomeClick = () => {
      clearSearch();
    };
  
    window.addEventListener("home-click", handleHomeClick);
  
    return () => {
      window.removeEventListener("home-click", handleHomeClick);
    };
  }, []);
  
  return (
    <div className="home-container">
      <div className="articles-header">
        <h2 className="articles-title">Articles</h2>

        <div className="workspace-filter">
          <label htmlFor="workspace">Workspace</label>
          <select
            id="workspace"
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
        </div>
      </div>

      <ArticleList
        articles={articles}
        loading={loading}
        search={search}
        onSearchChange={handleSearchChange}
        onRunSearch={runSearch}
        onClearSearch={clearSearch}
      />
    </div>
  );
}

export default HomePage;
