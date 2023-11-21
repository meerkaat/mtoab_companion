export function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new Error(msg);
}

export function getElementByIdTyped<T extends HTMLElement>(
  selector: string,
  msg = `Element '${selector}' not found`,
): T {
  const element = document.getElementById(selector);
  if (!element) throw new Error(msg);
  return element as T;
}