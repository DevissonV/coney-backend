import dayjs from 'dayjs';

/**
 * Transforms the validated raffle data into a DTO for creation.
 * @param {Object} data - The validated raffle data.
 * @returns {Object} A DTO containing only the necessary properties.
 */
export const createRaffleDto = (data) => ({
  name: data.name,
  description: data.description,
  init_date: data.initDate,
  end_date: data.endDate,
  price: data.price,
  tickets_created: data.ticketCount,
});

/**
 * Transforms the validated raffle data into a DTO for updating.
 * @param {Object} data - The validated raffle data.
 * @returns {Object} A DTO containing only the properties that can be updated.
 */
export const updateRaffleDto = (data) => ({
  name: data.name,
  description: data.description,
  init_date: data.initDate,
  end_date: data.endDate,
  price: data.price,
  updated_at: dayjs().toISOString(),
});

/**
 * Transforms the validated search criteria into a DTO for filtering raffles.
 * @param {Object} data - The validated query parameters.
 * @returns {Object} A DTO with standardized search criteria.
 */
export const searchRaffleDto = (data) => ({
  name: data.name,
  init_date: data.init_date,
  end_date: data.end_date,
  limit: data.limit,
  page: data.page,
});
