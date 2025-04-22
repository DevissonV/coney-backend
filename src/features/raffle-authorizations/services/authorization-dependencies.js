import AuthorizationUploadService from './authorization-upload-service.js';
import AuthorizationDocumentService from './authorization-document-service.js';
import AuthorizationService from './authorization-service.js';
import { createNotifyStatusChange } from './authorization-notifier-service.js';

import { uploadPrivateFileToS3 } from '../../uploads/services/upload-private-service.js';

import userRepository from '#features/users/repositories/user-repository.js';
import { AuthorizationNotificationServiceInstance } from '#features/send-emails/authorization-notifications/services/authorization-notification-service.js';

const authorizationUploadService = new AuthorizationUploadService(
  uploadPrivateFileToS3,
);

AuthorizationService.notifyStatusChange = createNotifyStatusChange({
  userRepository,
  authorizationNotificationService: AuthorizationNotificationServiceInstance,
});

export {
  AuthorizationService as authorizationService,
  AuthorizationDocumentService as authorizationDocumentService,
  authorizationUploadService,
};
