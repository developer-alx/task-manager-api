/** @param {import('node-pg-migrate').MigrationBuilder} pgm */

exports.up = (pgm) => {

  pgm.createTable("refresh_tokens", {

    id: {
      type: "serial",
      primaryKey: true
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade"
    },

    token: {
      type: "text",
      notNull: true
    },

    expires_at: {
      type: "timestamp",
      notNull: true
    }

  });

};

exports.down = (pgm) => {

  pgm.dropTable("refresh_tokens");

};