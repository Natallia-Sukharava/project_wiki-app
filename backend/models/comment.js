export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'Comments',
      timestamps: true,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article',
    });
  };

  return Comment;
};
