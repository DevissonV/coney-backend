export const up = async (knex) => {
  await knex.schema.createTable('raffles', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('description', 255).nullable();
    table.timestamp('init_date', { useTz: true }).notNullable();
    table.timestamp('end_date', { useTz: true }).notNullable();
    table.decimal('price', 10, 2).notNullable().defaultTo(10000);
    table.integer('ticket_count').notNullable().defaultTo(100);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('raffles');
};
