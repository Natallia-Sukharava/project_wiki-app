const API_URL = "http://localhost:4000/api/articles";
export const wsUrl = "ws://localhost:4000/ws";

export const getWorkspaces = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/workspaces");
    if (!res.ok) throw new Error("Failed to fetch workspaces");
    return await res.json();
  } catch (error) {
    console.error("Error loading workspaces:", error);
    return [];
  }
};

export const getWorkspaceArticles = async (workspaceId) => {
  try {
    const res = await fetch(`http://localhost:4000/api/workspaces/${workspaceId}/articles`);
    if (!res.ok) throw new Error("Failed to fetch articles of workspace");
    return await res.json();
  } catch (error) {
    console.error("Error loading workspace articles:", error);
    return [];
  }
};


export const getArticles = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch articles");
    return await response.json();
  } catch (error) {
    console.error("Error loading articles:", error);
    return [];
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch article");
    return await response.json();
  } catch (error) {
    console.error("Error loading article:", error);
    return null;
  }
};

export const createArticle = async (articleData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create article");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};
export const updateArticle = async (id, articleData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articleData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to update article");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};
export const deleteArticle = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to delete article");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const deleteAttachment = async (id, filename) => {
  try {
    const res = await fetch(`${API_URL}/${id}/attachments/${filename}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete attachment");

    return await res.json();
  } catch (error) {
    console.error("Error deleting attachment:", error);
    throw error;
  }
};

export const getAttachments = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}/attachments`);
    if (!res.ok) throw new Error("Failed to load attachments");
    return await res.json();
  } catch (err) {
    console.error("Error loading attachments:", err);
    return [];
  }
};

export const uploadAttachment = async (id, file) => {
  try {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API_URL}/${id}/attachments`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Upload failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Error uploading attachment:", err);
    throw err; 
  }
};

export const createComment = async (articleId, content) => {
  try {
    const res = await fetch(`http://localhost:4000/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) throw new Error("Failed to add comment");

    return await res.json();
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const res = await fetch(`http://localhost:4000/api/comments/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete comment");

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
