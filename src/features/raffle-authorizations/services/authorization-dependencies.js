import AuthorizationUploadService from './authorization-upload-service.js';
import AuthorizationDocumentService from './authorization-document-service.js';
import AuthorizationService from './authorization-service.js';

import { uploadPrivateFileToS3 } from '../../uploads/services/upload-private-service.js';

const authorizationUploadService = new AuthorizationUploadService(
  uploadPrivateFileToS3,
);

export {
  AuthorizationService as authorizationService,
  AuthorizationDocumentService as authorizationDocumentService,
  authorizationUploadService,
};
