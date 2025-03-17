/**
 * Transforms the validated country data into a DTO for creation.
 * @param {Object} data - The validated country data.
 * @returns {Object} A DTO containing only the necessary properties.
 */
export const createCountryDto = (data) => ({
  name: data.name.trim(),
});

/**
 * Transforms the validated country data into a DTO for updating.
 * @param {Object} data - The validated country data.
 * @returns {Object} A DTO containing only the properties that can be updated.
 */
export const updateCountryDto = (data) => ({
  name: data.name.trim(),
  updated_at: new Date().toISOString(),
});

/**
 * Transforms the validated search criteria into a DTO for filtering countries.
 * @param {Object} params - The validated query parameters.
 * @returns {Object} A DTO with the standardized search criteria.
 */
export const searchCountryDto = (params) => ({
  name: params.name ? params.name.trim() : undefined,
  limit: params.limit,
  page: params.page,
});
