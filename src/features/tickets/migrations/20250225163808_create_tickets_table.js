export const up = async (knex) => {
  await knex.schema.createTable('tickets', (table) => {
    table.increments('id').primary();
    table.integer('ticket_number').notNullable();
    table
      .integer('raffle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('raffles')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.unique(['raffle_id', 'ticket_number']);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('tickets');
};
