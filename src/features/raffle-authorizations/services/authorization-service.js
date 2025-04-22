import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import { generateSignedUrl } from '#core/s3/s3-signer.js';
import authorizationRepository from '../repositories/authorization-repository.js';
import authorizationDocumentRepository from '../repositories/authorization-document-repository.js';
import {
  createAuthorizationDto,
  updateAuthorizationDto,
  searchAuthorizationDto,
} from '../dto/authorization-dto.js';
import { validateAuthorizationCreate } from '../validations/authorization-create-validation.js';
import { validateAuthorizationUpdate } from '../validations/authorization-update-validation.js';
import { validateAuthorizationCriteria } from '../validations/authorization-criteria-validation.js';

/**
 * Service for managing raffle authorization records.
 * Limited to CRUD operations only.
 * @class AuthorizationService
 */
class AuthorizationService {
  /**
   * @param {Object} deps
   * @param {Function} [deps.notifyStatusChange] - Optional notifier callback triggered after update.
   */
  constructor({ notifyStatusChange } = {}) {
    this.notifyStatusChange = notifyStatusChange;
  }

  /**
   * Retrieves all authorizations with optional filtering, including signed document URLs.
   *
   * @param {Object} params - Query params
   * @returns {Promise<Object>} Paginated result with documents
   */
  async getAll(params) {
    try {
      const validated = validateAuthorizationCriteria(params);
      const dto = searchAuthorizationDto(validated);

      const criteria = new GenericCriteria(dto, {
        raffle_id: { column: 'raffle_id', operator: '=' },
        status: { column: 'status', operator: '=' },
        created_by: { column: 'created_by', operator: '=' },
      });

      const result = await authorizationRepository.getAll(criteria);

      const enriched = await Promise.all(
        result.data.map(async (auth) => {
          const documents =
            await authorizationDocumentRepository.findManyByField(
              'authorization_id',
              auth.id,
            );

          const docsWithUrls = await Promise.all(
            documents.map(async (doc) => ({
              id: doc.id,
              type: doc.type,
              uploaded_at: doc.uploaded_at,
              file_url: await generateSignedUrl(doc.file_url),
            })),
          );

          return {
            ...auth,
            documents: docsWithUrls,
          };
        }),
      );

      return {
        ...result,
        data: enriched,
      };
    } catch (error) {
      getLogger().error(`Error getAll authorizations: ${error.message}`);
      throw new AppError('Database error while retrieving authorizations', 500);
    }
  }

  /**
   * Creates a new authorization entry.
   *
   * @param {Object} data - Input data for creation.
   * @returns {Promise<Object>} The created authorization record.
   * @throws {AppError} If creation fails or validation fails.
   */
  async create(data) {
    try {
      const validated = validateAuthorizationCreate(data);
      const dto = createAuthorizationDto(validated);
      return await authorizationRepository.create(dto);
    } catch (error) {
      getLogger().error(`Error creating authorization: ${error.message}`);
      throw new AppError(
        error.message || 'Failed to create authorization',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Updates an existing authorization by ID.
   *
   * @param {number} id - ID of the authorization record.
   * @param {Object} data - Data to update.
   * @returns {Promise<Object>} The updated record.
   * @throws {AppError} If update fails or validation fails.
   */
  async update(id, data) {
    try {
      const validated = validateAuthorizationUpdate(data);
      const dto = updateAuthorizationDto(validated);
      const updated = await authorizationRepository.update(id, dto);

      if (this.notifyStatusChange) {
        this.notifyStatusChange(updated, data);
      }

      return updated;
    } catch (error) {
      getLogger().error(`Error updating authorization ${id}: ${error.message}`);
      throw new AppError(
        error.message || 'Failed to update authorization',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single authorization by its ID.
   *
   * @param {number} id - ID of the record.
   * @returns {Promise<Object>} The retrieved authorization.
   * @throws {AppError} If not found or retrieval fails.
   */
  async getById(id) {
    try {
      const auth = await authorizationRepository.getById(id);
      if (!auth) {
        throw new AppError(`Authorization ${id} not found`, 404);
      }
      return auth;
    } catch (error) {
      getLogger().error(
        `Error retrieving authorization ${id}: ${error.message}`,
      );
      throw new AppError(
        error.message || 'Failed to fetch authorization',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Deletes an authorization by its ID.
   *
   * @param {number} id - ID of the authorization.
   * @returns {Promise<void>}
   * @throws {AppError} If deletion fails.
   */
  async delete(id) {
    try {
      const authorization = await this.getById(id);
      return await authorizationRepository.delete(authorization.id);
    } catch (error) {
      getLogger().error(`Error deleting authorization ${id}: ${error.message}`);
      throw new AppError(
        error.message || 'Failed to delete authorization',
        error.statusCode || 500,
      );
    }
  }
}

export default new AuthorizationService();
