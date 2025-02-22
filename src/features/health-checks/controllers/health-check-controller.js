import {
  successResponse,
  errorResponse,
} from '../../../core/utils/response/response.js';

/**
 * Simulates a successful response for testing purposes.
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {void} Sends a successful response with mock employee data.
 */
export const testResponseSuccess = (req, res) => {
  const data = [
    {
      id: 1,
      hire_date: '2023-01-01T05:00:00.000Z',
      name: 'Devisson Vasquez',
      salary: '1000.00',
      created_at: '2024-12-21T15:10:53.214Z',
      updated_at: '2024-12-21T15:10:53.214Z',
    },
    {
      id: 2,
      hire_date: '2022-07-15T05:00:00.000Z',
      name: 'Andres Lora',
      salary: '1200.50',
      created_at: '2024-12-20T12:05:00.000Z',
      updated_at: '2024-12-20T12:05:00.000Z',
    },
  ];

  const response = {
    data,
    total: '2',
    page: 1,
    totalPages: 1,
  };

  return successResponse(res, response, 200, true);
};

/**
 * Simulates an error response for testing purposes.
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {void} Sends an error response with a predefined message.
 */
export const testResponseError = (req, res) => {
  const message = 'Simulated error for testing for request';
  return errorResponse(res, message, 400);
};
