export const up = async (knex) => {
  await knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 3).notNullable().defaultTo('COP');
    table
      .integer('raffle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('raffles')
      .onDelete('CASCADE');
    table.jsonb('tickets').notNullable();
    table.string('stripe_session_id').notNullable().unique();
    table
      .enum('status', ['pending', 'completed', 'failed'])
      .defaultTo('pending');
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('payments');
};
