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
import CreateWorkspaceModal from "./components/workspaces/CreateWorkspaceModal"; 
import { createWorkspace } from "./api/articles"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminUsers from "./pages/AdminUsers";
import "./styles/App.css";

function App() {
  const wsRef = useRef(null);
  const [workspaceModal, setWorkspaceModal] = useState(false);

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
  
      <Navbar onCreateWorkspace={() => setWorkspaceModal(true)} />
  
      <main className="main-container">
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
  
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
  
          <Route
            path="/article/:id"
            element={
              <ProtectedRoute>
                <ArticlePage />
              </ProtectedRoute>
            }
          />
  
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <NewArticlePage />
              </ProtectedRoute>
            }
          />
  
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditArticlePage />
              </ProtectedRoute>
            }
          />
  
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
