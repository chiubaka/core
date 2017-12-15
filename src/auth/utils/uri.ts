export function buildUri(hostname: string, path: string, port?: number, useSsl?: boolean): string {
  return `${useSsl ? "https" : "http"}://${hostname}${port ? `:${port}` : ""}${path}`;
}

export function buildOAuth2CallbackUri(hostname: string, path: string, provider: string, port?: number, useSsl?: boolean): string {
  return `${buildUri(hostname, path, port, useSsl)}${provider}/`;
}
