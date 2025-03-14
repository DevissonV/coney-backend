import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { loginUserDto } from '../dto/user-dto.js';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import userRepository from '../repositories/user-repository.js';
import { envs } from '#core/config/envs.js';
import { validateUserLogin } from '../validations/user-login.js';

/**
 * Service responsible for user session management, including authentication.
 * @class UserSessionService
 */
class UserSessionService {
  /**
   * Authenticates a user and generates a JWT token.
   *
   * @param {Object} credentials - The user's login credentials.
   * @param {string} credentials.email - The user's email address.
   * @param {string} credentials.password - The user's plain text password.
   * @returns {Promise<{token: string, role: string}>} The authentication token and user role.
   * @throws {AppError} If authentication fails due to incorrect credentials or database errors.
   */
  async login(credentials) {
    try {
      const validateParams = validateUserLogin(credentials);
      const dto = loginUserDto(validateParams);

      const user = await userRepository.findByEmail(dto.email);

      if (!user) {
        throw new AppError('Invalid username or password', 401);
      }
      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) {
        throw new AppError('Invalid username or password', 401);
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
        },
        envs.JWT_SECRET,
        { expiresIn: envs.JWT_TIME_EXPIRES },
      );

      return { token, role: user.role };
    } catch (error) {
      getLogger().error(`Error logging in user: ${error.message}`);
      throw new AppError(
        error.message || 'Database error during login',
        error.statusCode || 500,
      );
    }
  }
}

export default new UserSessionService();
