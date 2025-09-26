export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const asyncHandler = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return (req: any, res: any, next: any) => fn(req, res, next).catch(next);
};
