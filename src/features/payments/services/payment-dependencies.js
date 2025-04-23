import Stripe from 'stripe';
import { envs } from '#core/config/envs.js';

import PaymentExternalService from './payment-external-service.js';
import PaymentCompletionService from './payment-completion-service.js';

import paymentRepository from '../repositories/payment-repository.js';
import ticketRepository from '#features/tickets/repositories/ticket-repository.js';
import { getLogger } from '#core/utils/logger/logger.js';

const stripe = new Stripe(envs.STRIPE_SECRET_KEY);
const paymentExternalService = new PaymentExternalService(stripe);

const paymentCompletionService = new PaymentCompletionService(
  paymentRepository,
  ticketRepository,
  getLogger(),
);

export { paymentExternalService, paymentCompletionService };
