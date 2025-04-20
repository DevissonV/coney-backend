import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { generateSignedUrl } from '#core/s3/s3-signer.js';
import authorizationDocumentRepository from '../repositories/authorization-document-repository.js';

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
    const docs = await authorizationDocumentRepository.findManyByField(
      'authorization_id',
      authorizationId,
    );

    const withSignedUrls = await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        file_url: await generateSignedUrl(doc.file_url),
      })),
    );

    return withSignedUrls;
  }
}

export default new AuthorizationDocumentService();
