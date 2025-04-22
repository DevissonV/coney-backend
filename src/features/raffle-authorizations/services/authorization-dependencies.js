import AuthorizationUploadService from './authorization-upload-service.js';
import AuthorizationDocumentService from './authorization-document-service.js';
import AuthorizationService from './authorization-service.js'; // ← esta ya es una instancia
import { notifyStatusChange } from './authorization-notifier-service.js';

import { uploadPrivateFileToS3 } from '../../uploads/services/upload-private-service.js';

AuthorizationService.notifyStatusChange = notifyStatusChange;

const authorizationUploadService = new AuthorizationUploadService(
  uploadPrivateFileToS3,
);

export {
  AuthorizationService as authorizationService,
  AuthorizationDocumentService as authorizationDocumentService,
  authorizationUploadService,
};
