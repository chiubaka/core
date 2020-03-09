export interface IApiRequestOptions {
  // Disables any caching mechanisms for the next request. This option does nothing
  // for adapters that do not support caching.
  noCache?: boolean;
}
