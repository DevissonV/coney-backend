import Stripe from 'stripe';
import PaymentExternalService from './payment-external-service.js';
import { envs } from '#core/config/envs.js';

const stripe = new Stripe(envs.STRIPE_SECRET_KEY);
const paymentExternalService = new PaymentExternalService(stripe);

export { paymentExternalService };
