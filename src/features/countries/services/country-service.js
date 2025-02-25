import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import countryRepository from '../repositories/country-repository.js';
import { validateCountry } from '../validations/country-validation.js';
import { validateCountryCriteria } from '../validations/country-criteria-validation.js';
import {
  createCountryDto,
  updateCountryDto,
  searchCountryDto,
} from '../dto/country-dto.js';

/**
 * Service class for handling country business logic.
 * @class CountryService
 */
class CountryService {
  /**
   * Retrieves all countries.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object[]>} List of countries.
   */
  async getAll(params) {
    try {
      const validatedParams = validateCountryCriteria(params);
      const dto = searchCountryDto(validatedParams);

      const criteria = new GenericCriteria(dto, {
        name: { column: 'name', operator: 'like' },
      });

      return await countryRepository.getAll(criteria);
    } catch (error) {
      getLogger().error(`Error getAll countries: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving countries',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single country by ID.
   * @param {number} id - Country ID.
   * @returns {Promise<Object>} Country data.
   */
  async getById(id) {
    try {
      const country = await countryRepository.getById(id);
      if (!country) throw new AppError(`Country with ID ${id} not found`, 404);
      return country;
    } catch (error) {
      getLogger().error(`Error getById country: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving country',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Creates a new countries.
   * @param {Object} data - Countries details.
   * @returns {Promise<Object>} Created countries data.
   */
  async create(data) {
    try {
      validateCountry(data);
      const dto = createCountryDto(data);
      return await countryRepository.create(dto);
    } catch (error) {
      getLogger().error(`Error create country: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while creating country',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Updates an existing country.
   * @param {number} id - Country ID.
   * @param {Object} data - Updated Country details.
   * @returns {Promise<Object>} Updated country data.
   */
  async update(id, data) {
    try {
      const country = await this.getById(id);
      validateCountry(data);
      const dto = updateCountryDto(data);
      return await countryRepository.update(country.id, dto);
    } catch (error) {
      getLogger().error(`Error update country: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while updating country',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Deletes a country by ID.
   * @param {number} id - Country ID.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async delete(id) {
    try {
      const country = await this.getById(id);
      return await countryRepository.delete(country.id);
    } catch (error) {
      getLogger().error(`Error delete country: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while deleting country',
        error.statusCode || 500,
      );
    }
  }
}

export default new CountryService();
