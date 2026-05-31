exports.up = (pgm) => {
  pgm.createTable("tasks", {
    id: "id",

    title: {
      type: "varchar(255)",
      notNull: true,
    },

    description: {
      type: "text",
    },

    completed: {
      type: "boolean",
      default: false,
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("tasks");
};
