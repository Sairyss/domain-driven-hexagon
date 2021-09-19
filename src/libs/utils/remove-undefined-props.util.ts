/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Remove undefined properties from an object
 */
export function removeUndefinedProps(item: any): any {
  // TODO: make recursive for nested objects
  const filtered: any = {};
  for (const key of Object.keys(item)) {
    if (item[key]) filtered[key] = item[key];
  }
  return filtered;
}
