export class DemandError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DemandError';
    Object.setPrototypeOf(this, DemandError.prototype);
  }
}

export class DemandNotFoundError extends DemandError {
  constructor(demandId: string) {
    super(`Demand with id ${demandId} not found`, 'demand_not_found', 404);
    this.name = 'DemandNotFoundError';
    Object.setPrototypeOf(this, DemandNotFoundError.prototype);
  }
}

export class DemandValidationError extends DemandError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 'validation_error', 400, details);
    this.name = 'DemandValidationError';
    Object.setPrototypeOf(this, DemandValidationError.prototype);
  }
}

export class DemandConflictError extends DemandError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'demand_conflict', 409, details);
    this.name = 'DemandConflictError';
    Object.setPrototypeOf(this, DemandConflictError.prototype);
  }
}

