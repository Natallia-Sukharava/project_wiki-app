import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../styles/ArticleForm.css";

function ArticleForm({ initialData, workspaces, onSubmit, submitting }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");

  const [workspaceId, setWorkspaceId] = useState(
    initialData?.workspaceId || workspaces?.[0]?.id || ""
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setWorkspaceId(initialData.workspaceId);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, workspaceId });
  };

  return (
    <div className="article-form-container">
      <form className="article-form" onSubmit={handleSubmit}>
        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Workspace selector */}
        <select
          value={workspaceId}
          onChange={(e) => setWorkspaceId(Number(e.target.value))}
          required
        >
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>

        {/* Content */}
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Write your article content here..."
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default ArticleForm;
