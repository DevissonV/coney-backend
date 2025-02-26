export const up = async (knex) => {
  await knex.schema.createTable('tickets', (table) => {
    table.increments('id').primary();
    table.integer('ticket_number').notNullable();
    table
      .integer('raffle_id')
      .unsigned()
      .references('id')
      .inTable('raffles')
      .onDelete('SET NULL');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('tickets');
};
