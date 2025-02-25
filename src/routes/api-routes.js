import { Router } from 'express';
import healthCheckRoutes from '#features/health-checks/api/health-check-routes.js';
import userRoutes from '#features/users/api/user-routes.js';
import raffleRoutes from '#features/raffles/api/raffle-routes.js';
import countryRoutes from '#features/countries/api/country-routes.js';

const apiRoutes = Router();

apiRoutes.use('/users', userRoutes);
apiRoutes.use('/health-checks', healthCheckRoutes);
apiRoutes.use('/raffles', raffleRoutes);
apiRoutes.use('/countries', countryRoutes);

export default apiRoutes;
