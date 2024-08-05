import { objectify } from 'radash';

export const schemify = <T extends string>(...args: T[]) => {
  return {
    swagger: args,
    validator: objectify(
      args,
      (k) => k,
      () => true as true,
    ),
    extends<K extends string>(...args: K[]) {
      return schemify<T | K>(...args, ...this.swagger);
    },
  };
};
