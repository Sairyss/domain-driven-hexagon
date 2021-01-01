/**
 * Prevent instances from inherited classes.
 */
export function final<T extends { new (...args: any[]): object }>(
  target: T,
): T {
  return class Final extends target {
    constructor(...args: any[]) {
      if (new.target !== Final) {
        throw new Error('Cannot inherit from final class');
      }
      super(...args);
    }
  };
}
