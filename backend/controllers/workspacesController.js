import db from "../models/index.js";

// Create workspace
export const createWorkspace = async (req, res) => {
  try {
    const workspace = await db.Workspace.create({
      name: req.body.name
    });

    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
};

// Get all workspaces
export const getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await db.Workspace.findAll();
    res.json(workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
};

// Get one workspace + its articles
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await db.Workspace.findByPk(req.params.id, {
      include: [
        {
          model: db.Article,
          as: "articles",
        }
      ],
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workspace" });
  }
};

// Get ONLY articles of a workspace 
export const getWorkspaceArticles = async (req, res) => {
  try {
    const workspaceId = req.params.id;

    const articles = await db.Article.findAll({
      where: { workspaceId }
    });

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workspace articles" });
  }
};

// Update workspace
export const updateWorkspace = async (req, res) => {
  try {
    const workspace = await db.Workspace.findByPk(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    await workspace.update({ name: req.body.name });

    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update workspace" });
  }
};

// Delete workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await db.Workspace.findByPk(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    await workspace.destroy();
    res.json({ message: "Workspace deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete workspace" });
  }
};
