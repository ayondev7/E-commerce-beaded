export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const asyncHandler = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(next);
};
