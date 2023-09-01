#!/usr/bin/env bash
#

set -eux -o pipefail

case "$APP_ENV" in
  "dev")
    MINT_URL="https://dev.mint.cms.gov"
    export REACT_APP_OKTA_DOMAIN="https://test.idp.idm.cms.gov"
    ;;
  "test")
    MINT_URL="https://test.mint.cms.gov"
    export REACT_APP_OKTA_DOMAIN="https://test.idp.idm.cms.gov"
    ;;
  "impl")
    MINT_URL="https://impl.mint.cms.gov"
    export REACT_APP_OKTA_DOMAIN="https://impl.idp.idm.cms.gov"
    ;;
  "prod")
    MINT_URL="https://mint.cms.gov"
    export REACT_APP_OKTA_DOMAIN="https://idm.cms.gov"
    ;;
  *)
    echo "APP_ENV value not recognized: ${APP_ENV:-unset}"
    echo "Allowed values: 'dev', 'test', 'impl', 'prod'"
    exit 1
    ;;
esac

# Export REACT_APP_ environment variables required to build the app.
export REACT_APP_APP_ENV="$APP_ENV"
export REACT_APP_OKTA_CLIENT_ID="$OKTA_CLIENT_ID"
export REACT_APP_OKTA_SERVER_ID="$OKTA_SERVER_ID"
export REACT_APP_LD_CLIENT_ID="$LD_CLIENT_ID"
export REACT_APP_OKTA_ISSUER="${REACT_APP_OKTA_DOMAIN}/oauth2/${REACT_APP_OKTA_SERVER_ID}"
export REACT_APP_OKTA_REDIRECT_URI="${MINT_URL}/implicit/callback"
export REACT_APP_API_ADDRESS="${MINT_URL}/api/v1"
export REACT_APP_GRAPHQL_ADDRESS="${MINT_URL}/api/graph/query"
export REACT_APP_LOCAL_AUTH_ENABLED="false" # Disable deploying local auth

( set -x -u ;
  yarn install --frozen-lockfile
  yarn run build || exit
)
