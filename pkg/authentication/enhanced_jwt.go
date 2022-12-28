package authentication

import jwtverifier "github.com/okta/okta-jwt-verifier-golang"

// EnhancedJwt is the JWT and the auth token
type EnhancedJwt struct {
	JWT       *jwtverifier.Jwt
	AuthToken string
}
