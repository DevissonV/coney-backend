import { jest } from '@jest/globals';
import dayjs from 'dayjs';
import { AppError } from '#core/utils/response/error-handler.js';

import { validatePaymentCreate } from '#features/payments/validations/payment-create-validation.js';
import { validatePaymentCriteria } from '#features/payments/validations/payment-criteria-validation.js';
import { validatePaymentSession } from '#features/payments/validations/payment-session-validation.js';
import { validatePaymentUpdate } from '#features/payments/validations/payment-update-validation.js';
import { PaymentMother } from './mother/payment-mother.js';

import {
  createPaymentDto,
  updatePaymentDto,
  searchPaymentDto,
  generatePaymentDto,
} from '#features/payments/dto/payment-dto.js';

import paymentController from '#features/payments/controllers/payment-controller.js';
import { responseHandler } from '#core/utils/response/response-handler.js';
import { paymentCompletionService } from '#features/payments/services/payment-dependencies.js';
import PaymentCompletionService from '#features/payments/services/payment-completion-service.js';

import { getLogger } from '#core/utils/logger/logger.js';
import paymentRepository from '#features/payments/repositories/payment-repository.js';
import { PaymentValidationService } from '#features/payments/services/payment-validation-service.js';
import ticketRepository from '#features/tickets/repositories/ticket-repository.js';
import PaymentExternalService from '#features/payments/services/payment-external-service.js';

let logger = getLogger();

describe('Payment Validations', () => {
  // src/features/payments/validations/payment-create-validation.js
  it('should validate payment creation successfully', () => {
    const valid = {
      amount: 10000,
      raffleId: 1,
      tickets: [1, 2, 3],
    };
    expect(() => validatePaymentCreate(valid)).not.toThrow();
  });

  it('should fail payment creation with negative amount', () => {
    expect(() =>
      validatePaymentCreate({
        amount: -5000,
        raffleId: 1,
        tickets: [1, 2],
      }),
    ).toThrow(AppError);
  });

  it('should fail payment creation with missing raffleId', () => {
    expect(() =>
      validatePaymentCreate({
        amount: 10000,
        tickets: [1, 2],
      }),
    ).toThrow(AppError);
  });

  it('should fail payment creation with invalid tickets', () => {
    expect(() =>
      validatePaymentCreate({
        amount: 10000,
        raffleId: 1,
        tickets: ['a'],
      }),
    ).toThrow(AppError);
  });

  // src/features/payments/validations/payment-criteria-validation.js
  it('should validate payment criteria with valid input', () => {
    const criteria = { raffle_id: 1, status: 'completed', limit: 5, page: 1 };
    expect(() => validatePaymentCriteria(criteria)).not.toThrow();
  });

  it('should fail payment criteria with negative limit', () => {
    expect(() => validatePaymentCriteria({ limit: -1 })).toThrow(AppError);
  });

  it('should fail payment criteria with non-numeric page', () => {
    expect(() => validatePaymentCriteria({ page: 'abc' })).toThrow(AppError);
  });

  // src/features/payments/validations/payment-session-validation.js
  it('should validate payment session successfully', () => {
    const session = {
      id: 1,
      amount: 20000,
      raffleId: 5,
      tickets: [1, 2],
    };
    expect(() => validatePaymentSession(session)).not.toThrow();
  });

  it('should fail payment session with missing amount', () => {
    expect(() =>
      validatePaymentSession({
        id: 1,
        raffleId: 5,
        tickets: [1, 2],
      }),
    ).toThrow(AppError);
  });

  it('should fail payment session with empty ticket list', () => {
    expect(() =>
      validatePaymentSession({
        id: 1,
        amount: 20000,
        raffleId: 5,
        tickets: [],
      }),
    ).toThrow(AppError);
  });

  it('should fail payment session with missing raffleId', () => {
    expect(() =>
      validatePaymentSession({
        id: 1,
        amount: 20000,
        tickets: [1, 2],
      }),
    ).toThrow(AppError);
  });

  // src/features/payments/validations/payment-update-validation.js
  it('should validate payment update with status', () => {
    expect(() => validatePaymentUpdate({ status: 'completed' })).not.toThrow();
  });

  it('should fail payment update with invalid status', () => {
    expect(() => validatePaymentUpdate({ status: 'invalid_status' })).toThrow(
      AppError,
    );
  });
});

describe('Payment DTO', () => {
  it('should transform valid payment data into creation DTO', () => {
    const input = PaymentMother.validCreateDTO();
    const validated = validatePaymentCreate(input);
    const dto = createPaymentDto(validated);

    expect(dto).toEqual({
      amount: input.amount,
      currency: input.currency,
      raffle_id: input.raffleId,
      tickets: JSON.stringify(input.tickets),
      stripe_session_id: undefined,
      status: 'pending',
    });
  });

  it('should transform search criteria into DTO', () => {
    const input = PaymentMother.validSearchCriteria();

    const result = searchPaymentDto(input);

    expect(result).toEqual(input);
  });

  it('should transform update data into DTO with updated_at timestamp', () => {
    const input = PaymentMother.validUpdateDTO({ status: 'completed' });
    const dto = updatePaymentDto(input);

    expect(dto).toEqual(
      expect.objectContaining({
        status: 'completed',
      }),
    );
    expect(dayjs(dto.updated_at).isValid()).toBe(true);
  });

  it('should generate DTO for payment display purposes', () => {
    const input = PaymentMother.validDisplayDTO();

    const dto = generatePaymentDto(input);

    expect(dto).toEqual({
      id: input.id,
      raffleId: input.raffleId,
      amount: input.amount,
      tickets: input.tickets,
      currency: 'cop',
    });
  });
});

describe('Payment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(responseHandler, 'success').mockImplementation(jest.fn());
  });

  it('should respond with success() message', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    paymentController.success({}, res);

    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      {},
      'Payment successfully',
      200,
    );
  });

  it('should respond with cancel() message', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    paymentController.cancel({}, res);

    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      {},
      'Payment cancelled',
      200,
    );
  });

  it('should mark payment as completed', async () => {
    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jest
      .spyOn(paymentCompletionService, 'markAsCompleted')
      .mockResolvedValue({ success: true });

    await paymentController.markAsCompleted(req, res, next);

    expect(paymentCompletionService.markAsCompleted).toHaveBeenCalledWith(123);
    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      { success: true },
      'Payment marked as completed and tickets updated',
    );
  });
});

describe('PaymentRepository', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should retrieve expired pending payments correctly', async () => {
    const dto = PaymentMother.validCreateDTO();
    const mockData = [
      {
        id: 1,
        raffle_id: dto.raffleId,
        amount: dto.amount,
        tickets: JSON.stringify(dto.tickets),
        currency: dto.currency,
        status: 'pending',
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    const dbMock = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockResolvedValue(mockData),
    }));

    jest.unstable_mockModule('#core/config/database.js', () => ({
      default: dbMock,
    }));

    const { default: paymentRepository } = await import(
      '#features/payments/repositories/payment-repository.js'
    );

    const result = await paymentRepository.getExpiredPendingPayments(
      '2024-02-01T00:00:00Z',
    );

    expect(dbMock).toHaveBeenCalledWith('payments');
    expect(result).toEqual(mockData);
  });
});

describe('PaymentCompletionService', () => {
  it('should complete payment and mark tickets as paid', async () => {
    const paymentId = 10;
    const mockPayment = {
      id: paymentId,
      tickets: [1, 2, 3],
    };

    const mockPaymentRepository = {
      getById: jest.fn().mockResolvedValue(mockPayment),
      update: jest.fn().mockResolvedValue(),
    };

    const mockTicketRepository = {
      markTicketsAsPaid: jest.fn().mockResolvedValue(),
    };

    const service = new PaymentCompletionService(
      mockPaymentRepository,
      mockTicketRepository,
    );

    const result = await service.markAsCompleted(paymentId);

    expect(mockPaymentRepository.getById).toHaveBeenCalledWith(paymentId);
    expect(mockPaymentRepository.update).toHaveBeenCalledWith(paymentId, {
      status: 'completed',
    });
    expect(mockTicketRepository.markTicketsAsPaid).toHaveBeenCalledWith([
      1, 2, 3,
    ]);
    expect(result).toEqual({ success: true });
  });

  it('should throw AppError if payment is not found', async () => {
    const paymentId = 999;

    const mockPaymentRepository = {
      getById: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    };

    const mockTicketRepository = {
      markTicketsAsPaid: jest.fn(),
    };

    const service = new PaymentCompletionService(
      mockPaymentRepository,
      mockTicketRepository,
    );

    await expect(service.markAsCompleted(paymentId)).rejects.toThrow(AppError);
    await expect(service.markAsCompleted(paymentId)).rejects.toThrow(
      'Payment not found',
    );

    expect(mockPaymentRepository.getById).toHaveBeenCalledWith(paymentId);
    expect(mockPaymentRepository.update).not.toHaveBeenCalled();
    expect(mockTicketRepository.markTicketsAsPaid).not.toHaveBeenCalled();
  });
});

describe('PaymentValidationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 0 if there are no expired pending payments', async () => {
    jest
      .spyOn(paymentRepository, 'getExpiredPendingPayments')
      .mockResolvedValue([]);

    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});
    const result = await PaymentValidationService();

    expect(result).toEqual({ expiredPayments: 0 });
    expect(infoSpy).toHaveBeenCalledWith('No expired pending payments found');
  });

  it('should mark expired payments as failed and release tickets', async () => {
    const expiredPayment = {
      id: 55,
      tickets: [101, 102, 103],
    };

    const updateSpy = jest
      .spyOn(paymentRepository, 'update')
      .mockResolvedValue();

    const releaseSpy = jest
      .spyOn(ticketRepository, 'releaseTickets')
      .mockResolvedValue();

    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});

    jest
      .spyOn(paymentRepository, 'getExpiredPendingPayments')
      .mockResolvedValue([expiredPayment]);

    const result = await PaymentValidationService();

    expect(updateSpy).toHaveBeenCalledWith(55, { status: 'failed' });
    expect(releaseSpy).toHaveBeenCalledWith([101, 102, 103]);
    expect(infoSpy).toHaveBeenCalledWith(
      'Marked payment 55 as failed and released 3 tickets.',
    );
    expect(result).toEqual({ expiredPayments: 1 });
  });

  it('should throw AppError and log error if something fails', async () => {
    const fakeError = new Error('Database crashed');

    jest
      .spyOn(paymentRepository, 'getExpiredPendingPayments')
      .mockRejectedValue(fakeError);

    const loggerSpy = {
      info: jest.fn(),
      error: jest.fn(),
    };

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(loggerSpy.error);

    await expect(PaymentValidationService()).rejects.toThrow(AppError);
    expect(loggerSpy.error).toHaveBeenCalledWith(
      `Error validating pending payments: ${fakeError.message}`,
    );
  });
});

describe('PaymentExternalService', () => {
  it('should throw AppError if session creation fails', async () => {
    const mockStripe = {
      checkout: {
        sessions: {
          create: jest.fn().mockRejectedValue(new Error('Stripe failure')),
        },
      },
    };

    const service = new PaymentExternalService(mockStripe);

    const payment = PaymentMother.validCreateDTO({ id: 1 });

    await expect(service.createSession(payment)).rejects.toThrow(AppError);
    await expect(service.createSession(payment)).rejects.toThrow(
      'Error creating payment session',
    );
  });
});
