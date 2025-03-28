export const up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 50).notNullable().unique();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('password', 255).notNullable();
    table.boolean('is_email_validated').defaultTo(false);
    table.boolean('is_user_authorized').defaultTo(false);
    table.string('role').notNullable().defaultTo('anonymous');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true });
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('users');
};
