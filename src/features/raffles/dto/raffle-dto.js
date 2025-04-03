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
  created_by: data.createdBy,
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
  is_active: data.isActive,
  updated_by: data.updatedBy,
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
  is_active: data.is_active,
  created_by: data.created_by,
  updated_by: data.updated_by,
  limit: data.limit,
  page: data.page,
});
