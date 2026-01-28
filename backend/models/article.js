import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.Workspace, {
        foreignKey: 'workspaceId',
        as: 'workspace',
        onDelete: 'CASCADE',
      });

      Article.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
      });

      Article.hasMany(models.Comment, {
        foreignKey: 'articleId',
        as: 'comments',
        onDelete: 'CASCADE',
      });

      Article.hasMany(models.ArticleVersion, {
        foreignKey: 'articleId',
        as: 'versions',
        onDelete: 'CASCADE',
      });
    }
  }

  Article.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: 'Article',
      tableName: 'Articles',
      timestamps: true,
    }
  );

  return Article;
};
