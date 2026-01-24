import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/ArticleForm.css';

function ArticleForm({ initialData, workspaces, onSubmit, submitting }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [workspaceId, setWorkspaceId] = useState(
    initialData?.workspaceId || ''
  );
  const [workspaceError, setWorkspaceError] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setWorkspaceId(initialData.workspaceId);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Please enter a title before saving the article.');
      return;
    }

    if (!workspaceId) {
      setWorkspaceError('Please select a workspace before saving the article.');
      return;
    }

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
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError('');
          }}
        />

        {titleError && <p className="form-error">{titleError}</p>}

        <select
          value={workspaceId}
          onChange={(e) => {
            setWorkspaceId(Number(e.target.value));
            setWorkspaceError('');
          }}
        >
          <option value="">Select workspace</option>
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>
        {workspaceError && <p className="form-error">{workspaceError}</p>}

        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Write your article content here..."
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}

export default ArticleForm;
