/**
 * Custom API error class with HTTP status codes.
 * Replaces ad-hoc `throw new Error("UNAUTHORIZED")` patterns.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Convenience factory methods */
  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401);
  }

  static badRequest(message = "Bad request") {
    return new ApiError(message, 400);
  }

  static notFound(message = "Not found") {
    return new ApiError(message, 404);
  }

  static internal(message = "Internal server error") {
    return new ApiError(message, 500);
  }
}
