import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      
    }
  }

  Article.init(
    {
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
