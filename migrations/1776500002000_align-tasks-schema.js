exports.up = async (pgm) => {

  pgm.dropColumn(
    "tasks",
    "completed"
  );

  pgm.addColumn(
    "tasks",
    {
      status: {
        type: "varchar(20)",
        notNull: true,
        default: "pending",
      },

      updated_at: {
        type: "timestamp",
        default: pgm.func("current_timestamp"),
      },
    }
  );

  pgm.addConstraint(
    "tasks",
    "tasks_status_check",
    {
      check: "status IN ('pending','in_progress','completed')",
    }
  );
};


exports.down = async (pgm) => {

  pgm.dropConstraint(
    "tasks",
    "tasks_status_check"
  );

  pgm.dropColumn(
    "tasks",
    "status"
  );

  pgm.dropColumn(
    "tasks",
    "updated_at"
  );


  pgm.addColumn(
    "tasks",
    {
      completed: {
        type: "boolean",
        default: false,
      },
    }
  );
};
