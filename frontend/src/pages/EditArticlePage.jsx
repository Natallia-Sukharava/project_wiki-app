import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById, updateArticle } from "../api/articles";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      const article = await getArticleById(id);
      if (article) {
        setTitle(article.title);
        setContent(article.content);
      } else {
        toast.error("Article not found");
        navigate("/");
      }
    };
    fetchArticle();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateArticle(id, { title, content });
      toast.success("Article updated successfully!");
      navigate(`/article/${id}`);
    } catch (error) {
      toast.error(error.message || "Failed to update article");
    }
  };

  return (
    <div className="edit-article-container">
      <h2>Edit Article</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
        <ReactQuill value={content} onChange={setContent} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditArticlePage;
