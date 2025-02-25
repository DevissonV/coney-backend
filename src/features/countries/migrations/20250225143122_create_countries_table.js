export const up = async (knex) => {
  await knex.schema.createTable('countries', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('countries');
};
