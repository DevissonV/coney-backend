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
});
