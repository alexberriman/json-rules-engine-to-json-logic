export class CompatibilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompatibilityError";

    Object.setPrototypeOf(this, CompatibilityError.prototype);
  }
}
