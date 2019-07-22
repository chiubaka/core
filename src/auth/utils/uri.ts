export function buildUri(hostname: string, path: string, port?: string, useSsl?: boolean): string {
  return `${useSsl ? "https" : "http"}://${hostname}${port != null ? `:${port}` : ""}${path}`;
}

export function buildOAuth2CallbackUri(path: string, provider: string): string {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const useSsl = window.location.protocol.includes("https");
  return `${buildUri(hostname, path, port, useSsl)}${provider}/`;
}
