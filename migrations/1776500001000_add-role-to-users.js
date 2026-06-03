exports.up = (pgm) => {
  pgm.addColumn("users", {
    role: { type: "varchar(20)", notNull: true, default: "user" }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("users", "role");
};
