import * as uuid from "uuid";

export * from "./Model";
export * from "./types";

export function generateId(): string {
  return uuid.v4();
}
