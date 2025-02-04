interface IApiError {
  statusCode: number;
  message: string;
  data: any | null;
  success: boolean;
  errors: string[];
  stack?: string;
}

class ApiError extends Error implements IApiError {
  statusCode: number;
  data: any | null;
  success: boolean;
  errors: string[];
  constructor(
    statusCode = 500,
    message = "Something Went Wrong!",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
