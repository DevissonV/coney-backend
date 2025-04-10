export const up = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.string('photo_url', 500);
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('photo_url');
  });
};
