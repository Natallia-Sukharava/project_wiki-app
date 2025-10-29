import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../styles/ArticleForm.css";

function ArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Server is unavailable or request failed.");
      }

      const data = await response.json();
      alert("Article created successfully!");
      setTitle("");
      setContent("");
      navigate("/");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to connect to server. Please make sure backend is running.");
    }
  };

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <ReactQuill value={content} onChange={setContent} />
      <button type="submit">Save</button>
    </form>
  );
}

export default ArticleForm;