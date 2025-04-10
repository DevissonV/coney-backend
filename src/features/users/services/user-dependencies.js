import UserPhotoService from './user-photo-service.js';
import { uploadFileToS3 } from '../../uploads/services/upload-service.js';

const userPhotoServiceInstance = new UserPhotoService(uploadFileToS3);

export { userPhotoServiceInstance as userPhotoService };
