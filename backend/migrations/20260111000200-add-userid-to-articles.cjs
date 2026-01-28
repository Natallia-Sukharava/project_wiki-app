'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add column as nullable
    await queryInterface.addColumn('Articles', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // 2. Set all existing articles to belong to first user (admin later)
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC LIMIT 1`
    );

    if (users.length > 0) {
      await queryInterface.sequelize.query(
        `UPDATE "Articles" SET "userId" = ${users[0].id} WHERE "userId" IS NULL`
      );
    }

    // 3. Make userId NOT NULL
    await queryInterface.changeColumn('Articles', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Articles', 'userId');
  },
};
