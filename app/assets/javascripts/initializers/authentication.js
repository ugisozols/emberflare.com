window.ENV = window.ENV || {};
window.ENV["simple-auth"] = {
  authorizer: "simple-auth-authorizer:oauth2-bearer",
  store: "simple-auth-session-store:cookie",
  authenticationRoute: "signin",
  routeAfterAuthentication: "entries.index",
  routeAfterInvalidation: "entries.index"
}
