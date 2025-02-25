import BaseController from '#core/base/base-controller.js';
import countryService from '../services/country-service.js';

/**
 * Controller for managing countries.
 * @class CountryController
 * @extends BaseController
 */
class CountryController extends BaseController {
  constructor() {
    super(countryService, 'Country');
  }
}

export default new CountryController();
