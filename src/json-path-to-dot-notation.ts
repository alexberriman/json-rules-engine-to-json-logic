import { CompatibilityError } from "./compatibility-error";

export function jsonPathToDotNotation(path: string): string {
  // replace brackets with dot notation
  const withoutBrackets = path.replace(
    /\[(?:[']?)([a-zA-Z0-9\-_]+)(?:[']?)\]/g,
    ".$1"
  );

  // if not valid dot notation, throw error
  const isValid = /^\$(?:[.]{1}[a-zA-Z0-9_-]+)+$/.test(withoutBrackets);
  if (!isValid) {
    throw new CompatibilityError(
      "can not convert between json-path and dot notation"
    );
  }

  return withoutBrackets.substring("$.".length);
}
