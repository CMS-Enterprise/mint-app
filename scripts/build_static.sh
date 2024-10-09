#!/usr/bin/env bash
#

set -eux -o pipefail

case "$APP_ENV" in
  "dev")
    MINT_URL="https://dev.mint.cms.gov"
    export VITE_OKTA_DOMAIN="https://test.idp.idm.cms.gov"
    export VITE_ECHIMP_URL="https://echimp.fake/eeChimpWeb/sso" # We don't integrate with ECHIMP in our dev account, so we can use a fake URL
    ;;
  "test")
    MINT_URL="https://test.mint.cms.gov"
    export VITE_OKTA_DOMAIN="https://test.idp.idm.cms.gov"
    export VITE_ECHIMP_URL="https://echimp.cmsdev.local/eeChimpWeb/sso"
    ;;
  "impl")
    MINT_URL="https://impl.mint.cms.gov"
    export VITE_OKTA_DOMAIN="https://impl.idp.idm.cms.gov"
    export VITE_ECHIMP_URL="https://echimp.cms.cmsval/eeChimpWeb/sso"
    ;;
  "prod")
    MINT_URL="https://mint.cms.gov"
    export VITE_OKTA_DOMAIN="https://idm.cms.gov"
    export VITE_ECHIMP_URL="https://echimp.cmsnet/eeChimpWeb/sso"
    ;;
  *)
    echo "APP_ENV value not recognized: ${APP_ENV:-unset}"
    echo "Allowed values: 'dev', 'test', 'impl', 'prod'"
    exit 1
    ;;
esac

# Export VITE_ environment variables required to build the app.
export VITE_APP_ENV="$APP_ENV"
export VITE_OKTA_CLIENT_ID="$OKTA_CLIENT_ID"
export VITE_OKTA_SERVER_ID="$OKTA_SERVER_ID"
export VITE_LD_CLIENT_ID="$LD_CLIENT_ID"
export VITE_OKTA_ISSUER="${VITE_OKTA_DOMAIN}/oauth2/${VITE_OKTA_SERVER_ID}"
export VITE_OKTA_REDIRECT_URI="${MINT_URL}/implicit/callback"
export VITE_API_ADDRESS="${MINT_URL}/api/v1"
export VITE_GRAPHQL_ADDRESS="${MINT_URL}/api/graph/query"
export VITE_LOCAL_AUTH_ENABLED="false" # Disable deploying local auth

( set -x -u ;
  yarn install --frozen-lockfile
  yarn run build || exit
)
