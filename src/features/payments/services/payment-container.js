import ChannelService from './channel-service.js';
import PaymentService from './payment-service.js';
import PaymentController from '../controller/payment-controller.js';

const channelService = new ChannelService();
const paymentService = new PaymentService(channelService);
const paymentController = new PaymentController(paymentService);

export const container = {
    channelService,
    paymentService,
    paymentController
};