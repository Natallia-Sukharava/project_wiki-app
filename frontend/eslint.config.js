import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/ArticleForm.css';

function ArticleForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.warn('Please enter both title and content before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create article.');
      }

      toast.success('Article created successfully!');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to connect to server.');
    }
  };

  return (
    <div className="article-form-container">
      <h2>Create New Article</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Write your article content here..."
        />
        <button type="submit">Save</button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default ArticleForm;
