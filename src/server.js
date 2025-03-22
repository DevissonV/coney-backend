import express from 'express';
import cors from 'cors';
import { envs } from '#core/config/envs.js';
import { corsOptions } from '#core/config/cors-options.js';
import { getLogger } from '#core/utils/logger/logger.js';
import { scheduleLogManagement } from '#core/utils/logger/log-manager.js';
import errorMiddleware from '#core/middlewares/error-middleware.js';
import apiRoutes from './routes/api-routes.js';

const logger = getLogger();
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);

app.use((req, res) => {
  logger.warn(`Route not found: ${req.originalUrl}`);
  res
    .status(404)
    .json({ status: false, code: 404, message: 'Route not found' });
});

app.use(errorMiddleware);

app.listen(envs.APP_PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${envs.APP_PORT}`);
});

scheduleLogManagement();

export default app;
