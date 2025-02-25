/**
 * Standard success messages for API responses.
 */
export const successMessages = {
  GET_ALL: 'records retrieved successfully',
  GET_ONE: 'record retrieved successfully',
  CREATE: 'record created successfully',
  UPDATE: 'record updated successfully',
  DELETE: 'record deleted successfully',
};

/**
 * Generates a success message based on the action and entity name.
 * @param {string} action - The action (GET_ALL, GET_ONE, CREATE, UPDATE, DELETE).
 * @param {string} entity - The name of the entity (e.g., "Employee").
 * @returns {string} The formatted success message.
 */
export const getSuccessMessage = (action, entity) =>
  `${entity} ${successMessages[action]}`;
