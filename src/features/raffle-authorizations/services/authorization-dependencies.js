import AuthorizationUploadService from './authorization-upload-service.js';
import AuthorizationDocumentService from './authorization-document-service.js';
import AuthorizationService from './authorization-service.js';
import { uploadFileToS3 } from '../../uploads/services/upload-service.js';

/**
 * Dependency Injection Container for the Raffle Authorization feature.
 * Ensures all services are wired with their proper dependencies.
 */

AuthorizationUploadService.uploadFileFn = uploadFileToS3;

export {
  AuthorizationService as authorizationService,
  AuthorizationDocumentService as authorizationDocumentService,
  AuthorizationUploadService as authorizationUploadService,
};
