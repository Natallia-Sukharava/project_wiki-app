const API_URL = 'http://localhost:4000/api/articles';
export const wsUrl = 'ws://localhost:4000/ws';

// BASE FETCH WRAPPER

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),

      ...(options.headers || {}),

      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    console.warn('🔴 Unauthorized → clearing session');

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login';
    return;
  }

  return res;
}

// WORKSPACES

export const getWorkspaces = async () => {
  const res = await apiFetch('http://localhost:4000/api/workspaces');
  return res.json();
};

export const getWorkspaceArticles = async (workspaceId) => {
  const res = await apiFetch(
    `http://localhost:4000/api/workspaces/${workspaceId}/articles`
  );
  return res.json();
};

// ARTICLES

export const getArticles = async (search = '') => {
  const params = new URLSearchParams();

  if (search.trim() !== '') {
    params.append('search', search);
  }

  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;

  const res = await apiFetch(url);
  return res.json();
};

export const getArticleById = async (id) => {
  const res = await apiFetch(`${API_URL}/${id}`);
  return res.json();
};

export const createArticle = async (data) => {
  const res = await apiFetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateArticle = async (id, data) => {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteArticle = async (id) => {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  return res.json();
};

// ARTICLE VERSIONS

export async function getArticleVersionById(versionId) {
  const res = await apiFetch(
    `http://localhost:4000/api/article-versions/version/${versionId}`
  );

  if (!res.ok) throw new Error('Failed to load version');
  return res.json();
}

export async function getArticleVersionsWithCurrent(articleId) {
  const res = await apiFetch(
    `http://localhost:4000/api/article-versions/article/${articleId}/with-current`
  );

  if (!res.ok) throw new Error('Failed to load versions');
  return res.json();
}

// ATTACHMENTS

export const getAttachments = async (id) => {
  const res = await apiFetch(`${API_URL}/${id}/attachments`);
  return res.json();
};

export const uploadAttachment = async (id, file) => {
  const fd = new FormData();
  fd.append('file', file);

  const res = await apiFetch(`${API_URL}/${id}/attachments`, {
    method: 'POST',
    body: fd,
  });

  return res.json();
};

export const deleteAttachment = async (id, filename) => {
  const res = await apiFetch(`${API_URL}/${id}/attachments/${filename}`, {
    method: 'DELETE',
  });

  return res.json();
};

// COMMENTS

export const createComment = async (articleId, content) => {
  const res = await apiFetch(
    `http://localhost:4000/api/articles/${articleId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    }
  );

  return res.json();
};

export const deleteComment = async (id) => {
  const res = await apiFetch(`http://localhost:4000/api/comments/${id}`, {
    method: 'DELETE',
  });

  return res.json();
};

// WORKSPACE CREATE

export async function createWorkspace(data) {
  const res = await apiFetch('http://localhost:4000/api/workspaces', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create workspace');

  return res.json();
}

// Download PDF

export const downloadArticlePdf = async (articleId) => {
  const res = await apiFetch(`${API_URL}/${articleId}/pdf`, {
    method: 'GET',
  });

  if (!res || !res.ok) {
    throw new Error('Failed to download PDF');
  }

  return res.blob();
};
