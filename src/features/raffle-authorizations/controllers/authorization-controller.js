import BaseController from '#core/base/base-controller.js';
import { responseHandler } from '#core/utils/response/response-handler.js';
import { getSuccessMessage } from '#core/utils/response/api-response-templates.js';
import {
  authorizationService,
  authorizationUploadService,
  authorizationDocumentService,
} from '../services/authorization-dependencies.js';

/**
 * Controller for managing raffle authorization logic.
 * Extends BaseController to handle standard CRUD + custom logic.
 * @class AuthorizationController
 * @extends BaseController
 */
class AuthorizationController extends BaseController {
  constructor() {
    super(authorizationService, 'Authorization');

    this.uploadDocument = this.uploadDocument.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
  }

  /**
   * Handles the upload and registration of an authorization document.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void}
   */
  uploadDocument(req, res, next) {
    const { raffleId } = req.params;
    const { type, authorizationId } = req.body;

    authorizationUploadService
      .uploadDocument({
        buffer: req.file?.buffer,
        originalname: req.file?.originalname,
        raffleId: parseInt(raffleId, 10),
        type,
      })
      .then((fileUrl) =>
        authorizationDocumentService.create({
          authorizationId: parseInt(authorizationId, 10),
          type,
          fileUrl,
        }),
      )
      .then((createdDoc) =>
        responseHandler.success(
          res,
          createdDoc,
          getSuccessMessage('CREATE', 'Authorization Document'),
        ),
      )
      .catch(next);
  }

  /**
   * Retrieves all documents uploaded for a given authorization.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void}
   */
  getDocuments(req, res, next) {
    const { authorizationId } = req.params;

    authorizationDocumentService
      .getByAuthorizationId(parseInt(authorizationId, 10))
      .then((documents) =>
        responseHandler.success(
          res,
          documents,
          getSuccessMessage('GET_ALL', 'Authorization Documents'),
        ),
      )
      .catch(next);
  }

  /**
   * Deletes a specific authorization document by ID.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void}
   */
  deleteDocument(req, res, next) {
    const { id } = req.params;

    authorizationDocumentService
      .delete(parseInt(id, 10))
      .then(() =>
        responseHandler.success(
          res,
          {},
          getSuccessMessage('DELETE', 'Authorization Document'),
        ),
      )
      .catch(next);
  }
}

export default new AuthorizationController();
