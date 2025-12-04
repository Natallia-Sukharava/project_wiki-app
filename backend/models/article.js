import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.Workspace, {
        foreignKey: "workspaceId",
        as: "workspace",
        onDelete: "CASCADE",
      });

      Article.hasMany(models.Comment, {
        foreignKey: "articleId",
        as: "comments",
        onDelete: "CASCADE",
      });
    }
  }

  Article.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "Articles",
      timestamps: true,
    }
  );

  return Article;
};
