"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidPort(port) {
    return port != null && !isNaN(port) && port >= 0 && port <= 65535;
}
function buildUri(hostname, path, port, useSsl) {
    const portString = isValidPort(port) ? `:${port}` : "";
    return `${useSsl ? "https" : "http"}://${hostname}${portString}${path}`;
}
exports.buildUri = buildUri;
function buildOAuth2CallbackUri(path, provider) {
    const hostname = window.location.hostname;
    const port = parseInt(window.location.port, 10);
    const useSsl = window.location.protocol.includes("https");
    return `${buildUri(hostname, path, port, useSsl)}${provider}/`;
}
exports.buildOAuth2CallbackUri = buildOAuth2CallbackUri;

//# sourceMappingURL=../../dist/auth/utils/uri.js.map
