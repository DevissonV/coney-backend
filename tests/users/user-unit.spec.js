import { jest } from '@jest/globals';

import { AppError } from '#core/utils/response/error-handler.js';
import { UserMother } from './mother/user-mother.js';

import { validateUserCreate } from '#features/users/validations/user-create-validation.js';
import { validateUserPhoto } from '#features/users/validations/user-photo-validation.js';
import { validateUserLogin } from '#features/users/validations/user-login.js';
import { validateUserUpdate } from '#features/users/validations/user-update-validation.js';
import { validateUserCriteria } from '#features/users/validations/user-criteria-validation.js';

import {
  createUserDto,
  updateUserDto,
  searchUserDto,
  loginUserDto,
} from '#features/users/dto/user-dto.js';
import dayjs from 'dayjs';

import { responseHandler } from '#core/utils/response/response-handler.js';
import userController from '#features/users/controllers/user-controller.js';
import { userPhotoService } from '#features/users/services/user-dependencies.js';
import userRepository from '#features/users/repositories/user-repository.js';
import UserSesionService from '#features/users/services/user-sesion-service.js';

describe('User Validation', () => {
  // src/features/users/validations/user-create-validation.js
  it('should pass with valid user DTO (create)', () => {
    const dto = UserMother.validCreateDTO();
    expect(() => validateUserCreate(dto)).not.toThrow();
  });

  it('should fail with missing email (create)', () => {
    const dto = UserMother.validCreateDTO({ email: undefined });
    expect(() => validateUserCreate(dto)).toThrow(AppError);
  });

  it('should fail with invalid role (create)', () => {
    const dto = UserMother.validCreateDTO({ role: 'invalid' });
    expect(() => validateUserCreate(dto)).toThrow(AppError);
  });

  // src/features/users/validations/user-photo-validation.js
  it('should pass with valid userId (photo)', () => {
    expect(() => validateUserPhoto({ userId: 1 })).not.toThrow();
  });

  it('should fail with missing userId (photo)', () => {
    expect(() => validateUserPhoto({})).toThrow(AppError);
  });

  it('should fail with string userId (photo)', () => {
    expect(() => validateUserPhoto({ userId: 'abc' })).toThrow(AppError);
  });

  it('should fail with negative userId (photo)', () => {
    expect(() => validateUserPhoto({ userId: -1 })).toThrow(AppError);
  });

  it('should fail with decimal userId (photo)', () => {
    expect(() => validateUserPhoto({ userId: 3.14 })).toThrow(AppError);
  });

  // src/features/users/validations/user-login.js
  it('should pass with valid login data', () => {
    expect(() =>
      validateUserLogin({ email: 'user@example.com', password: '123456' }),
    ).not.toThrow();
  });

  it('should fail with missing email (login)', () => {
    expect(() => validateUserLogin({ password: '123456' })).toThrow(AppError);
  });

  it('should fail with missing password (login)', () => {
    expect(() => validateUserLogin({ email: 'user@example.com' })).toThrow(
      AppError,
    );
  });

  it('should fail with invalid email format (login)', () => {
    expect(() =>
      validateUserLogin({ email: 'bad-email', password: '123456' }),
    ).toThrow(AppError);
  });

  // src/features/users/validations/user-update-validation.js
  it('should pass with valid partial update', () => {
    expect(() => validateUserUpdate({ firstName: 'Updated' })).not.toThrow();
  });

  it('should fail with short password (update)', () => {
    expect(() => validateUserUpdate({ password: '123' })).toThrow(AppError);
  });

  it('should fail with invalid role (update)', () => {
    expect(() => validateUserUpdate({ role: 'invalid' })).toThrow(AppError);
  });

  it('should fail if isEmailValidated is not boolean (update)', () => {
    expect(() => validateUserUpdate({ isEmailValidated: 'yes' })).toThrow(
      AppError,
    );
  });

  it('should fail if isUserAuthorized is not boolean (update)', () => {
    expect(() => validateUserUpdate({ isUserAuthorized: 'nope' })).toThrow(
      AppError,
    );
  });

  // src/features/users/validations/user-criteria-validation.js
  it('should pass with valid criteria (email + page)', () => {
    expect(() =>
      validateUserCriteria({ email: 'a@a.com', page: 1 }),
    ).not.toThrow();
  });

  it('should fail with invalid email (criteria)', () => {
    expect(() => validateUserCriteria({ email: 'bad-email' })).toThrow(
      AppError,
    );
  });

  it('should fail with negative page (criteria)', () => {
    expect(() => validateUserCriteria({ page: -1 })).toThrow(AppError);
  });

  it('should fail with invalid role (criteria)', () => {
    expect(() => validateUserCriteria({ role: 'superadmin' })).toThrow(
      AppError,
    );
  });
});

describe('User DTO', () => {
  it('should transform user creation data to DTO', () => {
    const input = {
      email: '  USER@MAIL.COM ',
      firstName: 'John',
      lastName: 'Doe',
      password: 'pass123',
      role: 'admin',
      isEmailValidated: true,
      isUserAuthorized: true,
    };

    const result = createUserDto(input);

    expect(result).toEqual({
      email: 'user@mail.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'pass123',
      role: 'admin',
      is_email_validated: true,
      is_user_authorized: true,
    });
  });

  it('should transform user update data and include updated_at', () => {
    const input = {
      firstName: 'Updated',
      role: 'user',
      isEmailValidated: false,
      photoUrl: 'http://img.com/pic.jpg',
    };

    const result = updateUserDto(input);

    expect(result).toEqual(
      expect.objectContaining({
        first_name: 'Updated',
        role: 'user',
        is_email_validated: false,
        photo_url: 'http://img.com/pic.jpg',
      }),
    );

    expect(dayjs(result.updated_at).isValid()).toBe(true);
  });

  it('should omit undefined optional fields in updateUserDto', () => {
    const input = {
      firstName: 'OnlyName',
    };

    const result = updateUserDto(input);

    expect(result).toEqual(
      expect.objectContaining({
        first_name: 'OnlyName',
      }),
    );
    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('photo_url');
    expect(result).toHaveProperty('updated_at');
  });

  it('should transform search criteria without modification', () => {
    const input = {
      email: 'a@a.com',
      page: 1,
      limit: 10,
      role: 'user',
      is_email_validated: true,
      first_name: 'A',
      last_name: 'B',
      is_user_authorized: false,
    };

    const result = searchUserDto(input);

    expect(result).toEqual(input);
  });

  it('should normalize email in login DTO', () => {
    const input = {
      email: '  LOGIN@DOMAIN.COM ',
      password: 'secret123',
    };

    const result = loginUserDto(input);

    expect(result).toEqual({
      email: 'login@domain.com',
      password: 'secret123',
    });
  });

  it('should include password if present in update', () => {
    const input = { firstName: 'John', password: '12345678' };
    const result = updateUserDto(input);

    expect(result).toHaveProperty('password', '12345678');
  });

  it('should include is_email_validated if present', () => {
    const input = { isEmailValidated: true };
    const result = updateUserDto(input);

    expect(result).toHaveProperty('is_email_validated', true);
  });

  it('should include is_user_authorized if present', () => {
    const input = { isUserAuthorized: false };
    const result = updateUserDto(input);

    expect(result).toHaveProperty('is_user_authorized', false);
  });

  it('should include photo_url if present', () => {
    const input = { photoUrl: 'https://img.com/avatar.png' };
    const result = updateUserDto(input);

    expect(result).toHaveProperty('photo_url', 'https://img.com/avatar.png');
  });
});

describe('User Controller', () => {
  it('should upload photo and respond with success', async () => {
    const req = {
      file: {
        buffer: Buffer.from('img-data'),
        originalname: 'avatar.png',
      },
      params: { id: 123 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();
    const photoResult = { photoUrl: 'https://cdn.com/avatar.png' };

    userPhotoService.saveProfilePicture = jest
      .fn()
      .mockResolvedValue(photoResult);
    responseHandler.success = jest.fn();

    await userController.uploadPhoto(req, res, next);
    await new Promise(process.nextTick);

    expect(userPhotoService.saveProfilePicture).toHaveBeenCalledWith(
      req.file.buffer,
      req.file.originalname,
      req.params.id,
    );

    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      photoResult,
      'User Photo record updated successfully',
    );
  });
});

describe('User Repository', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should find user by email including password', async () => {
    const baseUser = UserMother.validCreateDTO();
    const mockUser = {
      id: 1,
      ...baseUser,
    };

    const dbMock = jest.fn(() => ({
      where: jest.fn(() => ({
        select: jest.fn(() => ({
          first: jest.fn().mockResolvedValue(mockUser),
        })),
      })),
    }));

    jest.unstable_mockModule('#core/config/database.js', () => ({
      default: dbMock,
    }));

    const { default: userRepository } = await import(
      '#features/users/repositories/user-repository.js'
    );

    const result = await userRepository.findByEmail(baseUser.email);
    expect(result).toEqual(mockUser);
    expect(dbMock).toHaveBeenCalledWith('users');
  });

  it('should get basic user info by ID', async () => {
    const mockUser = {
      id: 2,
      email: 'b@b.com',
      first_name: 'Another',
      last_name: 'User',
    };

    const dbMock = jest.fn(() => ({
      where: jest.fn(() => ({
        select: jest.fn(() => ({
          first: jest.fn().mockResolvedValue(mockUser),
        })),
      })),
    }));

    jest.unstable_mockModule('#core/config/database.js', () => ({
      default: dbMock,
    }));

    const { default: userRepository } = await import(
      '#features/users/repositories/user-repository.js'
    );

    const result = await userRepository.getBasicInfoById(2);
    expect(result).toEqual(mockUser);
    expect(dbMock).toHaveBeenCalledWith('users');
  });

  it('should sanitize record and remove password field', async () => {
    const baseUser = UserMother.validCreateDTO();
    const record = {
      id: 3,
      ...baseUser,
      password: 'sensitive123',
    };

    const { default: userRepository } = await import(
      '#features/users/repositories/user-repository.js'
    );
    const sanitized = userRepository.sanitizeRecord(record);

    expect(sanitized).not.toHaveProperty('password');
    expect(sanitized).toEqual(
      expect.objectContaining({
        id: 3,
        email: baseUser.email,
        firstName: baseUser.firstName,
        lastName: baseUser.lastName,
        role: baseUser.role,
      }),
    );
  });
});

describe('User Photo Service', () => {
  const buffer = Buffer.from('img-data');
  const originalname = 'avatar.png';
  const userId = 10;

  it('should upload photo and update user with URL', async () => {
    const fakeUrl = 'https://s3.amazonaws.com/users/avatar.png';
    const mockUpload = jest.fn().mockResolvedValue(fakeUrl);

    const updateSpy = jest
      .spyOn(
        (await import('#features/users/repositories/user-repository.js'))
          .default,
        'update',
      )
      .mockResolvedValue();

    const { default: UserPhotoService } = await import(
      '#features/users/services/user-photo-service.js'
    );

    const service = new UserPhotoService(mockUpload);
    const result = await service.saveProfilePicture(
      buffer,
      originalname,
      userId,
    );

    expect(mockUpload).toHaveBeenCalledWith({
      buffer,
      originalname,
      folder: 'users',
    });
    expect(updateSpy).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ photo_url: fakeUrl }),
    );
    expect(result).toEqual({ photoUrl: fakeUrl });
  });

  it('should throw AppError when userId is invalid', async () => {
    const buffer = Buffer.from('img-data');
    const originalname = 'avatar.png';
    const userId = 'abc';

    const mockUpload = jest.fn();

    const { default: UserPhotoService } = await import(
      '#features/users/services/user-photo-service.js'
    );
    const service = new UserPhotoService(mockUpload);

    let error;
    try {
      await service.saveProfilePicture(buffer, originalname, userId);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toMatch(/user id must be a number/i);
    expect(mockUpload).not.toHaveBeenCalled();
  });
});

describe('UserSesionService - Errors', () => {
  it('should throw AppError when user does not exist or password is incorrect', async () => {
    const dto = UserMother.validLoginDTO();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    await expect(UserSesionService.login(dto)).rejects.toThrow(AppError);
    await expect(UserSesionService.login(dto)).rejects.toThrow(
      'Invalid username or password',
    );
  });

  it('should throw AppError when findByEmail throws an error', async () => {
    const dto = UserMother.validLoginDTO();
    const error = new Error('Database failure');

    jest.spyOn(userRepository, 'findByEmail').mockRejectedValue(error);

    await expect(UserSesionService.login(dto)).rejects.toThrow(AppError);
    await expect(UserSesionService.login(dto)).rejects.toThrow(
      'Database failure',
    );
  });
});
