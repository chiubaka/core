// Returns a version of T without the keys specified in K
// Ex. Omit<{ id: string, name?: string }, "id"> => { name?: string }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
