export class CompatibilityError extends Error {
  constructor(message: string, private data: Record<string, unknown> = {}) {
    super(message);
    this.name = "CompatibilityError";

    Object.setPrototypeOf(this, CompatibilityError.prototype);
  }
}
