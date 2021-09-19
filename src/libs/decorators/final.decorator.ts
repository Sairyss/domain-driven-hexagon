/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Prevents other classes extending a class marked by this decorator.
 */
export function final<T extends { new (...args: any[]): object }>(
  target: T,
): T {
  return class Final extends target {
    constructor(...args: any[]) {
      if (new.target !== Final) {
        throw new Error(`Cannot extend a final class "${target.name}"`);
      }
      super(...args);
    }
  };
}
