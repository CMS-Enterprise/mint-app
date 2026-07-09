export const isLocalAuthEnabled = () =>
  import.meta.env.VITE_LOCAL_AUTH_ENABLED === 'true';

// TODO(MINT-3761): remove this helper (and VITE_OKTA_REDIRECT_LOGIN_ENABLED) once redirect
// login is permanent and the embedded Sign-In Widget rollback path is gone.
/** When true, /signin uses Okta redirect (ELP) instead of the embedded Sign-In Widget. */
export const isOktaRedirectLoginEnabled = () =>
  import.meta.env.VITE_OKTA_REDIRECT_LOGIN_ENABLED === 'true';
