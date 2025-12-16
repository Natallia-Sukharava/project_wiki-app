import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ArticleVersion extends Model {
    static associate(models) {
      ArticleVersion.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
        onDelete: "CASCADE",
      });
    }
  }

  ArticleVersion.init(
    {
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      versionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ArticleVersion",
      tableName: "ArticleVersions",
      timestamps: true,
      updatedAt: false, 
    }
  );

  return ArticleVersion;
};
