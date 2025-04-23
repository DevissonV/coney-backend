import { AppError } from '#core/utils/response/error-handler.js';
import { UserMother } from './mother/user-mother.js';

import { validateUserCreate } from '#features/users/validations/user-create-validation.js';
import { validateUserPhoto } from '#features/users/validations/user-photo-validation.js';
import { validateUserLogin } from '#features/users/validations/user-login.js';
import { validateUserUpdate } from '#features/users/validations/user-update-validation.js';
import { validateUserCriteria } from '#features/users/validations/user-criteria-validation.js';

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
