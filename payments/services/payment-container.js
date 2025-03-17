import ChannelService from './channel-service.js';
import PaymentService from './payment-service.js';
import PaymentController from '../controller/payment-controller.js';
import Stripe from 'stripe';
import { envs } from '#core/config/envs.js';

const stripe = new Stripe(envs.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const channelService = new ChannelService();
const paymentService = new PaymentService(channelService, stripe);
const paymentController = new PaymentController(paymentService);

export const container = {
    channelService,
    paymentService,
    paymentController
};