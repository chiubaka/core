"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildUri(hostname, path, port, useSsl) {
    return `${useSsl ? "https" : "http"}://${hostname}${port ? `:${port}` : ""}${path}`;
}
exports.buildUri = buildUri;
function buildOAuth2CallbackUri(hostname, path, provider, port, useSsl) {
    return `${buildUri(hostname, path, port, useSsl)}${provider}/`;
}
exports.buildOAuth2CallbackUri = buildOAuth2CallbackUri;

//# sourceMappingURL=../../dist/auth/utils/uri.js.map
