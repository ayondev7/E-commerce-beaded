export class AppError extends Error {
  public isOperational: boolean;

  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors?: any) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors?: any) {
    super(400, message, errors);
  }
}
