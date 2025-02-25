export const seed = async (knex) => {
  await knex('countries')
    .insert([
      { name: 'Argentina' },
      { name: 'Bolivia' },
      { name: 'Brasil' },
      { name: 'Canadá' },
      { name: 'Chile' },
      { name: 'Colombia' },
      { name: 'Costa Rica' },
      { name: 'Cuba' },
      { name: 'Ecuador' },
      { name: 'El Salvador' },
      { name: 'España' },
      { name: 'Estados Unidos' },
      { name: 'Francia' },
      { name: 'Guatemala' },
      { name: 'Honduras' },
      { name: 'Italia' },
      { name: 'México' },
      { name: 'Nicaragua' },
      { name: 'Panamá' },
      { name: 'Paraguay' },
      { name: 'Perú' },
      { name: 'Portugal' },
      { name: 'Puerto Rico' },
      { name: 'República Dominicana' },
      { name: 'Uruguay' },
      { name: 'Venezuela' },
      { name: 'Alemania' },
      { name: 'Reino Unido' },
      { name: 'Japón' },
      { name: 'Corea del Sur' },
    ])
    .onConflict('name')
    .ignore();
};
