import dayjs from 'dayjs';

/**
 * Transforms the validated users data into a DTO for creation.
 * @param {Object} data - The validated users data.
 * @returns {Object} A DTO containing only the necessary properties.
 */
export const createUserDto = (data) => ({
  email: data.email,
  first_name: data.firstName,
  last_name: data.lastName,
  password: data.password,
  role: data.role,
  is_email_validated: data.isEmailValidated ?? false,
  is_user_authorized: data.isUserAuthorized ?? false,
});

/**
 * Transforms the validated users data into a DTO for updating.
 * @param {Object} data - The validated users data.
 * @returns {Object} A DTO containing only the properties that can be updated.
 */
export const updateUserDto = (data) => {
  const dto = {
    first_name: data.firstName,
    last_name: data.lastName,
    role: data.role,
    updated_at: dayjs().toISOString(),
  };

  if (data.password) {
    dto.password = data.password;
  }

  if (data.isEmailValidated !== undefined) {
    dto.is_email_validated = data.isEmailValidated;
  }

  if (data.isUserAuthorized !== undefined) {
    dto.is_user_authorized = data.isUserAuthorized;
  }

  return dto;
};

/**
 * Transforms the validated search criteria into a DTO for filtering users.
 * @param {Object} params - The validated query parameters.
 * @returns {Object} A DTO with the standardized search criteria.
 */
export const searchUserDto = (data) => ({
  email: data.email,
  first_name: data.first_name,
  last_name: data.last_name,
  role: data.role,
  is_email_validated: data.is_email_validated,
  is_user_authorized: data.is_user_authorized,
  limit: data.limit,
  page: data.page,
});

/**
 * (Optional) Transforms the login credentials into a DTO.
 * In this case, the data is returned as is.
 * @param {Object} data - The login credentials.
 * @returns {Object} The DTO for user login.
 */
export const loginUserDto = (data) => ({
  email: data.email,
  password: data.password,
});
