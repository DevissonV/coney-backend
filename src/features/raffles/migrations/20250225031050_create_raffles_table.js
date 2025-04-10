export const up = async (knex) => {
  await knex.schema.createTable('raffles', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('description', 255).nullable();
    table.timestamp('init_date', { useTz: true }).notNullable();
    table.timestamp('end_date', { useTz: true }).notNullable();
    table.decimal('price', 10, 2).notNullable().defaultTo(10000);
    table.integer('tickets_created').notNullable().defaultTo(100);
    table.boolean('is_active').notNullable().defaultTo(true);
    table
      .integer('created_by')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    table
      .integer('updated_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users');
    table.string('photo_url', 250);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true });
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('raffles');
};
