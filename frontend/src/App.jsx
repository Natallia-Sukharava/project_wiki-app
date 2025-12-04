import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef, useState } from "react";
import { wsUrl } from "./api/articles";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import NewArticlePage from "./pages/NewArticlePage";
import EditArticlePage from "./pages/EditArticlePage";
import CreateWorkspaceModal from "./components/workspaces/CreateWorkspaceModal"; // ⭐ NEW
import { createWorkspace } from "./api/articles"; // ⭐ NEW
import "./styles/App.css";
console.log("MY APP IS RUNNING, wsUrl =", wsUrl);

function App() {
  const wsRef = useRef(null);
  const [workspaceModal, setWorkspaceModal] = useState(false); // ⭐ NEW

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);

      if (msg.type === "article_created") {
        toast.success(`New article created: ${msg.title}`);
      } else if (msg.type === "article_updated") {
        toast.info(`Article updated: ${msg.title}`);
      } else if (msg.type === "attachment_added") {
        toast.success(`New attachment in article ${msg.articleId}: ${msg.fileName}`);
      }
    };

    return () => ws.close();
  }, []);

  // workspace
  const handleCreateWorkspace = async (name) => {
    try {
      await createWorkspace({ name });
      toast.success("Workspace created!");
    } catch (err) {
      toast.error("Failed to create workspace");
    } finally {
      setWorkspaceModal(false);
    }
  };

  return (
    <Router>
      <Navbar onCreateWorkspace={() => setWorkspaceModal(true)} /> {/* ⭐ NEW */}

      <main className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/new" element={<NewArticlePage />} />
          <Route path="/edit/:id" element={<EditArticlePage />} />
        </Routes>

        {workspaceModal && (
          <CreateWorkspaceModal
            onClose={() => setWorkspaceModal(false)}
            onSubmit={handleCreateWorkspace}
          />
        )}

        <ToastContainer position="top-center" autoClose={5000} />
      </main>
    </Router>
  );
}

export default App;
