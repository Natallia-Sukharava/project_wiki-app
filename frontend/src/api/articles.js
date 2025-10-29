const API_URL = "http://localhost:4000/api/articles";

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
      const text = await response.text();
      throw new Error(`Server error: ${response.status} — ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving article:", error);
    throw error;
  }
};