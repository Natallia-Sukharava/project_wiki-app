export default (sequelize, DataTypes) => {
    const Workspace = sequelize.define("Workspace", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    Workspace.associate = (models) => {
      Workspace.hasMany(models.Article, {
        foreignKey: "workspaceId",
        onDelete: "CASCADE",
      });
    };
  
    return Workspace;
  };  