export const up = async (knex) => {
  await knex.schema.createTable('password_recovery_tokens', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('token', 255).notNullable().unique();
    table.boolean('used').defaultTo(false).notNullable();
    table.timestamp('expires_at', { useTz: true }).notNullable();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true });
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('password_recovery_tokens');
};
