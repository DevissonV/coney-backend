export const up = async (knex) => {
  await knex.schema.createTable('winners', (table) => {
    table.increments('id').primary();
    table
      .integer('raffle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('raffles')
      .onDelete('CASCADE');
    table
      .integer('ticket_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('tickets')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['raffle_id']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('winners');
};
