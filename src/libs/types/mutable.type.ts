/**
 * Makes all properties of the type mutable
 * (removes readonly flag)
 */
export type Mutable<T> = {
  -readonly [key in keyof T]: T[key];
};

/**
 * Makes all properties of the type mutable recursively
 * (removes readonly flag, including in nested objects)
 */
export type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };
