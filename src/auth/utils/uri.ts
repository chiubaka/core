function isValidPort(port: number) {
  return port != null && !isNaN(port) && port >= 0 && port <= 65535;
}

export function buildUri(hostname: string, path: string, port?: number, useSsl?: boolean): string {
  const portString = isValidPort(port) ? `:${port}` : "";
  return `${useSsl ? "https" : "http"}://${hostname}${portString}${path}`;
}

export function buildOAuth2CallbackUri(path: string, provider: string): string {
  const hostname = window.location.hostname;
  const port = parseInt(window.location.port, 10);
  const useSsl = window.location.protocol.includes("https");
  return `${buildUri(hostname, path, port, useSsl)}${provider}/`;
}
