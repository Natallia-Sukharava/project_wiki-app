export default (sequelize, DataTypes) => {
  const Workspace = sequelize.define(
    "Workspace",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Workspaces",
      timestamps: true,
    }
  );

  Workspace.associate = (models) => {
    Workspace.hasMany(models.Article, {
      foreignKey: "workspaceId",
      as: "articles",
      onDelete: "CASCADE",
    });
  };

  return Workspace;
};