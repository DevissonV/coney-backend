export const up = async (knex) => {
  await knex.schema.createTable('raffle_authorization_documents', (table) => {
    table.increments('id').primary();
    table
      .integer('authorization_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('raffle_authorizations')
      .onDelete('CASCADE');
    table.string('type', 50).notNullable();
    table.string('file_url', 255).notNullable();
    table.timestamp('uploaded_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('raffle_authorization_documents');
};
