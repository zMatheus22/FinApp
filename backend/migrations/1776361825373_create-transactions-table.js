/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("transactions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    category_id: {
      type: "uuid",
      notNull: true,
      references: "categories",
      onDelete: "cascade",
    },
    type: {
      type: "varchar(20)",
      notNull: true,
      check: "type IN ('receita', 'despesa')",
    },
    date: {
      type: "date",
      notNull: true,
    },
    amount: {
      type: "numeric(10, 2)",
      notNull: true,
    },
    description: {
      type: "text",
    },
    created_at: {
      type: "timestamp with time zone",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp with time zone",
      default: pgm.func("now()"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
