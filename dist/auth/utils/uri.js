"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildUri(hostname, path, port, useSsl) {
    return `${useSsl ? "https" : "http"}://${hostname}${port != null ? `:${port}` : ""}${path}`;
}
exports.buildUri = buildUri;
function buildOAuth2CallbackUri(path, provider) {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const useSsl = window.location.protocol.includes("https");
    return `${buildUri(hostname, path, port, useSsl)}${provider}/`;
}
exports.buildOAuth2CallbackUri = buildOAuth2CallbackUri;

//# sourceMappingURL=../../dist/auth/utils/uri.js.map
