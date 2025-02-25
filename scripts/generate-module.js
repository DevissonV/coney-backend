import fs from 'fs';
import path from 'path';
import { envs } from '#core/config/envs.js';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const singularize = (word) => {
  const irregularPlurals = {
    children: 'child',
    men: 'man',
    women: 'woman',
    people: 'person',
    feet: 'foot',
    mice: 'mouse',
    geese: 'goose',
    teeth: 'tooth',
    criteria: 'criterion',
    data: 'datum',
  };

  if (irregularPlurals[word]) {
    return irregularPlurals[word];
  }

  if (word.match(/(.*)ies$/)) {
    return word.replace(/ies$/, 'y');
  }

  if (word.match(/(.*)ves$/)) {
    return word.replace(/ves$/, 'f');
  }

  if (word.match(/(.*)oes$/)) {
    return word.replace(/oes$/, 'o');
  }

  if (
    word.match(/(.*)ses$/) &&
    !['addresses', 'series', 'species'].includes(word)
  ) {
    return word.replace(/es$/, '');
  }

  if (word.match(/(.*)s$/) && word.length > 3) {
    return word.replace(/s$/, '');
  }

  return word;
};

const moduleName = process.argv[2];
const singularModuleName = singularize(moduleName);

if (!singularModuleName) {
  console.error(
    'You must provide a module name. Example: node generate-module.js employee',
  );
  process.exit(1);
}

const modulePath = path.join('src/features', moduleName);
const folders = [
  'api',
  'controllers',
  'dto',
  'migrations',
  'repositories',
  'services',
  'validations',
];
const testFolder = `tests/${moduleName}`;

if (!fs.existsSync('src/features')) {
  fs.mkdirSync('src/features', { recursive: true });
}

if (!fs.existsSync(testFolder)) {
  fs.mkdirSync(testFolder, { recursive: true });
  console.log(`📂 Created folder: ${testFolder}`);
}

folders.forEach((folder) => {
  const folderPath = path.join(modulePath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📂 Created folder: ${folderPath}`);
  }
});

const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
const migrationFileName = `${timestamp}_create_${moduleName}_table.js`;

const files = {
  [`api/${singularModuleName}-routes.js`]: `import { Router } from 'express';
import { authenticate, authorize } from '#core/middlewares/auth-middleware.js';
import { envs } from '#core/config/envs.js';
import ${singularModuleName}Controller from '../controllers/${singularModuleName}-controller.js';

const router = Router();

router.get(
  '/', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  ${singularModuleName}Controller.getAll
);
router.get(
  '/:id', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  ${singularModuleName}Controller.getById
);
router.post(
  '/', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  ${singularModuleName}Controller.create
);
router.patch(
  '/:id', 
  authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  ${singularModuleName}Controller.update
);
router.delete(
  '/:id', authenticate, 
  authorize([envs.ROLE_ADMIN]), 
  ${singularModuleName}Controller.delete
);

export default router;`,

  [`controllers/${singularModuleName}-controller.js`]: `import BaseController from '#core/base/base-controller.js';
import ${singularModuleName}Service from '../services/${singularModuleName}-service.js';

/**
 * Controller for managing ${moduleName}.
 * @class ${capitalize(singularModuleName)}Controller
 * @extends BaseController
 */
class ${capitalize(singularModuleName)}Controller extends BaseController {
  constructor() {
    super(${singularModuleName}Service, '${capitalize(singularModuleName)}');
  }
}

export default new ${capitalize(singularModuleName)}Controller();`,

  [`dto/${singularModuleName}-dto.js`]: `
/**
 * Transforms the validated ${moduleName} data into a DTO for creation.
 * @param {Object} data - The validated ${moduleName} data.
 * @returns {Object} A DTO containing only the necessary properties.
 */
export const create${capitalize(singularModuleName)}Dto = (data) => data;

/**
 * Transforms the validated ${moduleName} data into a DTO for updating.
 * @param {Object} data - The validated ${moduleName} data.
 * @returns {Object} A DTO containing only the properties that can be updated.
 */
export const update${capitalize(singularModuleName)}Dto = (data) => data;

/**
 * Transforms the validated search criteria into a DTO for filtering ${moduleName}.
 * @param {Object} params - The validated query parameters.
 * @returns {Object} A DTO with the standardized search criteria.
 */
export const search${capitalize(singularModuleName)}Dto = (data) => data;`,

  [`migrations/${migrationFileName}`]: `export const up = async (knex) => {
  await knex.schema.createTable('${moduleName}', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('${moduleName}');
};`,

  [`repositories/${singularModuleName}-repository.js`]: `import BaseRepository from '#core/base/base-repository.js';

/**
 * Repository for managing ${moduleName} data.
 * @class ${capitalize(moduleName)}Repository
 * @extends BaseRepository
 */
class ${capitalize(singularModuleName)}Repository extends BaseRepository {
  constructor() {
    super('${moduleName}');
  }
}

export default new ${capitalize(singularModuleName)}Repository();`,

  [`services/${singularModuleName}-service.js`]: `import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import ${singularModuleName}Repository from '../repositories/${singularModuleName}-repository.js';
import { validate${capitalize(singularModuleName)} } from '../validations/${singularModuleName}-validation.js';
import { validate${capitalize(singularModuleName)}Criteria } from '../validations/${singularModuleName}-criteria-validation.js';
import { 
  create${capitalize(singularModuleName)}Dto, 
  update${capitalize(singularModuleName)}Dto, 
  search${capitalize(singularModuleName)}Dto 
} from '../dto/${singularModuleName}-dto.js';

/**
 * Service class for handling ${singularModuleName} business logic.
 * @class ${capitalize(singularModuleName)}Service
 */
class ${capitalize(singularModuleName)}Service {
  /**
   * Retrieves all ${moduleName}.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object[]>} List of ${moduleName}.
   */
  async getAll(params) {
    try {
      const validatedParams = validate${capitalize(singularModuleName)}Criteria(params);
      const dto = search${capitalize(singularModuleName)}Dto(validatedParams);
      
      const criteria = new GenericCriteria(dto, { 
        name: { column: 'name', operator: 'like' } 
      });

      return await ${singularModuleName}Repository.getAll(criteria);
    } catch (error) {
      getLogger().error(\`Error getAll ${moduleName}: \${error.message}\`);
      throw new AppError(
        error.message || 'Database error while retrieving ${moduleName}', 
        error.statusCode || 500
      );
    }
  }

  /**
   * Retrieves a single ${singularModuleName} by ID.
   * @param {number} id - ${capitalize(singularModuleName)} ID.
   * @returns {Promise<Object>} ${capitalize(singularModuleName)} data.
   */
  async getById(id) {
    try {
      const ${singularModuleName} = await ${singularModuleName}Repository.getById(id);
      if (!${singularModuleName}) 
        throw new AppError(\`${capitalize(singularModuleName)} with ID \${id} not found\`, 404);
      return ${singularModuleName};
    } catch (error) {
      getLogger().error(\`Error getById ${singularModuleName}: \${error.message}\`);
      throw new AppError(
        error.message || 'Database error while retrieving ${singularModuleName}', 
        error.statusCode || 500
      );
    }
  }

  /**
   * Creates a new ${moduleName}.
   * @param {Object} data - ${capitalize(moduleName)} details.
   * @returns {Promise<Object>} Created ${moduleName} data.
   */
  async create(data) {
    try {
      validate${capitalize(singularModuleName)}(data);
      const dto = create${capitalize(singularModuleName)}Dto(data);
      return await ${singularModuleName}Repository.create(dto);
    } catch (error) {
      getLogger().error(\`Error create ${singularModuleName}: \${error.message}\`);
      throw new AppError(
        error.message || 'Database error while creating ${singularModuleName}', 
        error.statusCode || 500
      );
    }
  }

  /**
   * Updates an existing ${singularModuleName}.
   * @param {number} id - ${capitalize(singularModuleName)} ID.
   * @param {Object} data - Updated ${capitalize(singularModuleName)} details.
   * @returns {Promise<Object>} Updated ${singularModuleName} data.
   */
  async update(id, data) {
    try {
      const ${singularModuleName} = await this.getById(id);
      validate${capitalize(singularModuleName)}(data);
      const dto = update${capitalize(singularModuleName)}Dto(data);
      return await ${singularModuleName}Repository.update(${singularModuleName}.id, dto);
    } catch (error) {
      getLogger().error(\`Error update ${singularModuleName}: \${error.message}\`);
      throw new AppError(
        error.message || 'Database error while updating ${singularModuleName}', 
        error.statusCode || 500
      );
    }
  }

  /**
   * Deletes a ${singularModuleName} by ID.
   * @param {number} id - ${capitalize(singularModuleName)} ID.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async delete(id) {
    try {
      const ${singularModuleName} = await this.getById(id);
      return await ${singularModuleName}Repository.delete(${singularModuleName}.id);
    } catch (error) {
      getLogger().error(\`Error delete ${singularModuleName}: \${error.message}\`);
      throw new AppError(
        error.message || 'Database error while deleting ${singularModuleName}', 
        error.statusCode || 500
      );
    }
  }
}

export default new ${capitalize(singularModuleName)}Service();`,

  [`validations/${singularModuleName}-validation.js`]: `import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for ${singularModuleName} validation.
 * @constant {Joi.ObjectSchema}
 */
const ${singularModuleName}Schema = Joi.object({ name: Joi.string().max(50).required() });

/**
 * Validates ${singularModuleName} data against the schema.
 * @param {Object} ${singularModuleName}Data - ${singularModuleName} data to be validated.
 * @throws {Error} If validation fails.
 */
export const validate${capitalize(singularModuleName)} = (data) => {
  const { error } = ${singularModuleName}Schema.validate(data);
  if (error) throw new AppError(error.details[0].message, 400);
  return data;
};`,

  [`validations/${singularModuleName}-criteria-validation.js`]: `import Joi from 'joi';
import { AppError } from '#core/utils/response/error-handler.js';

/**
 * Schema definition for validating ${singularModuleName} search criteria.
 * @constant {Joi.ObjectSchema}
 */
const ${singularModuleName}CriteriaSchema = Joi.object({ name: Joi.string().max(50).optional() });

/**
 * Validates the request search criteria using the defined schema.
 *
 * @param {Object} criteria - The search criteria object containing query parameters.
 * @returns {Object} The validated and possibly transformed criteria.
 * @throws {AppError} Throws an AppError with a 400 status code if validation fails.
 */
export const validate${capitalize(singularModuleName)}Criteria = (criteria) => {
  const { error, value } = ${singularModuleName}CriteriaSchema.validate(criteria);
  if (error) throw new AppError(error.details[0].message, 400);
  return value;
};`,
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(modulePath, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`📄 Created file: ${fullPath}`);
  }
});

const testFilePath = path.join(testFolder, `${singularModuleName}.spec.js`);
if (!fs.existsSync(testFilePath)) {
  fs.writeFileSync(
    testFilePath,
    `import app from '../../src/server.js';
import request from 'supertest';

describe('${capitalize(moduleName)} API', () => {
  it('should return 200 for GET /${moduleName}', async () => {
    const response = await request(app).get('/${moduleName}/');
    expect(response.status).toBe(200);
  });

  it('should return 404 for non-existing route', async () => {
    const response = await request(app).get('/non-existing-route');
    expect(response.status).toBe(404);
  });
});`,
    'utf8',
  );
  console.log(`📄 Created test file: ${testFilePath}`);
}

console.log(`✅ Module '${moduleName}' generated successfully!`);
