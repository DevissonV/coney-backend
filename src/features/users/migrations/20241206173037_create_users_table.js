export const up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 50).notNullable().unique();
    table.string('password').notNullable();
    table
      .enum('role', ['admin', 'user', 'anonymous'])
      .notNullable()
      .defaultTo('anonymous');
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('users');
};
