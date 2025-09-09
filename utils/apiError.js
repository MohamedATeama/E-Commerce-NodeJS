class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4")
      ? "failed"
      : "Server error";
  }
}

export default ApiError;