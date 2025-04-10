export const up = async (knex) => {
  const exists = await knex.schema.hasTable('raffles');
  if (exists) {
    await knex.schema.alterTable('raffles', (table) => {
      table.string('photo_url', 250);
    });
  }
};

export const down = async (knex) => {
  const exists = await knex.schema.hasTable('raffles');
  if (exists) {
    await knex.schema.alterTable('raffles', (table) => {
      table.dropColumn('image_url');
    });
  }
};
