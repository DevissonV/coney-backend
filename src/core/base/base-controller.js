import { responseHandler } from '../utils/response/response-handler.js';
import { getSuccessMessage } from '../utils/response/api-response-templates.js';

/**
 * BaseController: Base class for handling CRUD operations in controllers.
 * This class provides common CRUD methods that can be extended by specific controllers.
 *
 * @class BaseController
 */
export default class BaseController {
  /**
   * Creates an instance of BaseController.
   * @param {Object} service - The service handling the business logic for the resource.
   * @param {string} resourceName - The name of the resource (e.g., 'Employee', 'Request').
   */
  constructor(service, resourceName) {
    /**
     * The service instance associated with the controller.
     * @type {Object}
     * @private
     */
    this.#service = service;

    /**
     * The resource name used in response messages.
     * @type {string}
     * @private
     */
    this.#resourceName = resourceName;

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  /** @private */
  #service;

  /** @private */
  #resourceName;

  /**
   * Retrieves all records of the resource.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async getAll(req, res, next) {
    this.#service
      .getAll(req.query)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('GET_ALL', this.#resourceName),
        ),
      )
      .catch(next);
  }

  /**
   * Retrieves a single record by ID.
   * @param {import("express").Request} req - Express request object containing the ID.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async getById(req, res, next) {
    this.#service
      .getById(req.params.id)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('GET_ONE', this.#resourceName),
        ),
      )
      .catch(next);
  }

  /**
   * Creates a new record.
   * @param {import("express").Request} req - Express request object containing resource data.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async create(req, res, next) {
    this.#service
      .create(req.body, req.user)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('CREATE', this.#resourceName),
          201,
        ),
      )
      .catch(next);
  }
  /**
   * Updates an existing record by ID.
   * @param {import("express").Request} req - Express request object containing the ID and update data.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async update(req, res, next) {
    this.#service
      .update(req.params.id, req.body, req.user)
      .then((data) =>
        responseHandler.success(
          res,
          data,
          getSuccessMessage('UPDATE', this.#resourceName),
        ),
      )
      .catch(next);
  }

  /**
   * Deletes a record by ID.
   * @param {import("express").Request} req - Express request object containing the ID.
   * @param {import("express").Response} res - Express response object.
   * @param {import("express").NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async delete(req, res, next) {
    this.#service
      .delete(req.params.id)
      .then(() =>
        responseHandler.success(
          res,
          {},
          getSuccessMessage('DELETE', this.#resourceName),
        ),
      )
      .catch(next);
  }
}
