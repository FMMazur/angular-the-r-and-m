export const isOf = <T>(toCheck: any, property: keyof T): toCheck is T =>
  (toCheck as T)[property] !== undefined;
