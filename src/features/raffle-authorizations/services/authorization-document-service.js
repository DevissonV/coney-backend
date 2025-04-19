import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import authorizationDocumentRepository from '../repositories/authorization-document-repository.js';
import { validateAuthorizationCreate } from '../validations/authorization-create-validation.js';
import { validateAuthorizationUpdate } from '../validations/authorization-status-update-validation.js';

/**
 * Service class for handling CRUD operations on authorization documents.
 * This service is limited to basic DB actions. Upload logic is handled separately.
 * @class AuthorizationDocumentService
 */
class AuthorizationDocumentService {
  /**
   * Creates a new document record for a given raffle authorization.
   *
   * @param {Object} params - Document creation parameters.
   * @param {number} params.authorizationId - ID of the raffle authorization.
   * @param {string} params.type - Type of the document (e.g., 'identification_document').
   * @param {string} params.fileUrl - Public S3 URL of the uploaded document.
   * @returns {Promise<Object>} The created document record.
   * @throws {AppError} If creation fails.
   */
  async create({ authorizationId, type, fileUrl }) {
    try {
      return await authorizationDocumentRepository.create({
        authorization_id: authorizationId,
        type,
        file_url: fileUrl,
      });
    } catch (error) {
      getLogger().error(
        `Error creating authorization document: ${error.message}`,
      );
      throw new AppError('Failed to create document record', 500);
    }
  }

  /**
   * Deletes a document by its ID.
   *
   * @param {number} id - Document ID.
   * @returns {Promise<void>}
   * @throws {AppError} If deletion fails.
   */
  async delete(id) {
    try {
      return await authorizationDocumentRepository.delete(id);
    } catch (error) {
      getLogger().error(
        `Error deleting authorization document: ${error.message}`,
      );
      throw new AppError('Failed to delete document', 500);
    }
  }

  /**
   * Retrieves all documents associated with a given authorization.
   *
   * @param {number} authorizationId - ID of the raffle authorization.
   * @returns {Promise<Object[]>} List of documents.
   * @throws {AppError} If retrieval fails.
   */
  async getByAuthorizationId(authorizationId) {
    try {
      return await authorizationDocumentRepository.findManyByField(
        'authorization_id',
        authorizationId,
      );
    } catch (error) {
      getLogger().error(`Error fetching documents: ${error.message}`);
      throw new AppError('Failed to fetch documents', 500);
    }
  }
}

export default new AuthorizationDocumentService();
