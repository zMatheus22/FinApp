export class ErrorFormat extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      message: this.message,
      status_code: this.statusCode,
      name: this.name,
    };
  }
}
