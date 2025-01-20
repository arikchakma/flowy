export class FlowyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FlowyError';
  }

  static isFlowyError(error: unknown): error is FlowyError {
    return error instanceof FlowyError;
  }
}
