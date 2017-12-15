const typeCache: { [label: string]: boolean } = {};

export function type<T>(label: T | ""): T {
  if (typeCache[label as string]) {
    throw new Error(`Action type "${label}" is not unique`);
  }

  typeCache[label as string] = true;

  return label as T;
}
