export const PaymentMother = {
  validCreateDTO: (overrides = {}) => ({
    raffleId: 1,
    amount: 10000,
    tickets: [1, 2, 3],
    currency: 'COP',
    ...overrides,
  }),

  validUpdateDTO: (overrides = {}) => ({
    status: 'completed',
    ...overrides,
  }),

  async insertPayment(overrides = {}) {
    const data = this.validCreateDTO(overrides);
    const [id] = await db('payments')
      .insert({
        raffle_id: data.raffleId,
        amount: data.amount,
        tickets: JSON.stringify(data.tickets),
        currency: data.currency,
        status: data.status || 'pending',
        created_at: new Date().toISOString(),
      })
      .returning('id');
    return { id, ...data };
  },

  validSearchCriteria: (overrides = {}) => ({
    raffle_id: 42,
    status: 'pending',
    stripe_session_id: 'sess_xyz',
    limit: 10,
    page: 1,
    ...overrides,
  }),

  validSearchDTO: (overrides = {}) => ({
    raffle_id: 1,
    status: 'pending',
    stripe_session_id: 'session_abc',
    page: 1,
    limit: 10,
    ...overrides,
  }),

  validDisplayDTO: (overrides = {}) => ({
    id: 10,
    raffleId: 99,
    amount: 45000,
    tickets: [1, 2, 3],
    ...overrides,
  }),
};
