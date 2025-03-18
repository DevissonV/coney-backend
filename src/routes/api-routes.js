import { Router } from 'express';
import healthCheckRoutes from '#features/health-checks/api/health-check-routes.js';
import userRoutes from '#features/users/api/user-routes.js';
import raffleRoutes from '#features/raffles/api/raffle-routes.js';
import countryRoutes from '#features/countries/api/country-routes.js';
import ticketRoutes from '#features/tickets/api/ticket-routes.js';
import paymentRoutes from '#features/payments/api/payment-routes.js';
import winnerRoutes from '#features/winners/api/winner-routes.js';
import paymentRoutes from '#features/payments/api/payment-routes.js';

const apiRoutes = Router();

apiRoutes.use('/users', userRoutes);
apiRoutes.use('/health-checks', healthCheckRoutes);
apiRoutes.use('/raffles', raffleRoutes);
apiRoutes.use('/countries', countryRoutes);
apiRoutes.use('/tickets', ticketRoutes);
apiRoutes.use('/payments', paymentRoutes);
apiRoutes.use('/winners', winnerRoutes);
apiRoutes.use('/payments', paymentRoutes);

export default apiRoutes;
