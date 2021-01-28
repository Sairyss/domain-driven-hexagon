import { Entity } from '../base-classes/entity.base';
import { ValueObject } from '../base-classes/value-object.base';
/**
 * Converts props that usually consist of Value Objects to a plain object.
 * Useful for testing and debugging.
 * @param props
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function convertPropsToObject(props: any): any {
  const propsCopy = { ...props };
  // eslint-disable-next-line guard-for-in
  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[prop])) {
      propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map(item => {
        if (ValueObject.isValueObject(item)) {
          return item.getRawProps();
        }
        if (Entity.isEntity(item)) {
          return item.toObject();
        }
        return item;
      });
    }
    if (ValueObject.isValueObject(propsCopy[prop])) {
      propsCopy[prop] = propsCopy[prop].getRawProps();
    }
    if (Entity.isEntity(propsCopy[prop])) {
      propsCopy[prop] = propsCopy[prop].toObject();
    }
  }

  return propsCopy;
}
