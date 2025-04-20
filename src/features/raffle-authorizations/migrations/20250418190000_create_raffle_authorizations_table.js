export const up = async (knex) => {
  await knex.schema.createTable('raffle_authorizations', (table) => {
    table.increments('id').primary();
    table
      .integer('raffle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('raffles')
      .onDelete('CASCADE')
      .unique();
    table
      .enum('status', ['pending', 'reviewing', 'approved', 'rejected'])
      .notNullable()
      .defaultTo('pending');
    table.text('ticket_text').nullable();
    table.text('rejection_reason').nullable();
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('raffle_authorizations');
};
