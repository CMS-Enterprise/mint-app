package okta

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/handlers"
)

const (
	jobCodeUser       = "MINT_USER_NONPROD"
	jobCodeAssessment = "MINT_ASSESSMENT_NONPROD"
	jobCodeMAC        = "MINT MAC Users"
)

func (f oktaMiddlewareFactory) jwt(logger *zap.Logger, authHeader string) (*jwtverifier.Jwt, error) {
	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return nil, errors.New("invalid Bearer in auth header")
	}
	bearerToken := tokenParts[1]
	if bearerToken == "" {
		return nil, errors.New("empty bearer value")
	}

	return f.verifier.VerifyAccessToken(bearerToken)
}

func jwtGroupsContainsJobCode(jwt *jwtverifier.Jwt, jobCode string) bool {
	list, ok := jwt.Claims["mint-groups"]
	if !ok {
		return false
	}

	// json arrays decode to `[]interface{}`
	codes, ok := list.([]interface{})
	if !ok {
		return false
	}

	for _, code := range codes {
		if c, ok := code.(string); ok {
			if strings.EqualFold(c, jobCode) {
				return true
			}
		}
	}
	return false
}

func (f oktaMiddlewareFactory) newPrincipal(jwt *jwtverifier.Jwt) (*authentication.OKTAPrincipal, error) {
	euaID := jwt.Claims["sub"].(string)
	if euaID == "" {
		return nil, errors.New("unable to retrieve EUA ID from JWT")
	}

	// the current assumption is that anyone with an appropriate
	// JWT provided by Okta for MINT is allowed to use MINT
	// as a viewer/submitter
	jcUser := jwtGroupsContainsJobCode(jwt, f.jobCodeUser)

	// need to check the claims for empowerment as each role
	jcAssessment := jwtGroupsContainsJobCode(jwt, f.jobCodeAssessment)

	jcMAC := jwtGroupsContainsJobCode(jwt, f.jobCodeMAC)

	return &authentication.OKTAPrincipal{
		Username:          strings.ToUpper(euaID),
		JobCodeUSER:       jcUser,
		JobCodeASSESSMENT: jcAssessment,
		JobCodeMAC:        jcMAC,
	}, nil
}

func (f oktaMiddlewareFactory) newAuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger := appcontext.ZLogger(r.Context())
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer") {
			next.ServeHTTP(w, r)
			return
		}

		jwt, err := f.jwt(logger, authHeader)
		if err != nil {
			f.WriteErrorResponse(
				r.Context(),
				w,
				&apperrors.UnauthorizedError{Err: fmt.Errorf("unable to parse jwt: %w", err)},
			)
			return
		}

		principal, err := f.newPrincipal(jwt)
		if err != nil {
			f.WriteErrorResponse(
				r.Context(),
				w,
				&apperrors.UnauthorizedError{Err: fmt.Errorf("unable to get Principal from jwt: %w", err)},
			)
			return
		}
		logger = logger.With(zap.String("user", principal.ID())).With(zap.Bool("assessment", principal.AllowASSESSMENT()))

		ctx := r.Context()
		ctx = appcontext.WithPrincipal(ctx, principal)
		ctx = appcontext.WithLogger(ctx, logger)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewJwtVerifier returns a new JWT verifier with some minimal config
func NewJwtVerifier(clientID string, issuer string) *jwtverifier.JwtVerifier {
	toValidate := map[string]string{}
	toValidate["cid"] = clientID
	toValidate["aud"] = "mint"

	jwtVerifierSetup := jwtverifier.JwtVerifier{
		Issuer:           issuer,
		ClaimsToValidate: toValidate,
	}

	return jwtVerifierSetup.New()
}

// JwtVerifier collects the methods we call on a JWT verifier
type JwtVerifier interface {
	VerifyAccessToken(jwt string) (*jwtverifier.Jwt, error)
}

type oktaMiddlewareFactory struct {
	handlers.HandlerBase
	verifier          JwtVerifier
	jobCodeUser       string
	jobCodeAssessment string
	jobCodeMAC        string
}

// NewOktaAuthenticationMiddleware returns a wrapper for HandlerFunc to authorize with Okta
func NewOktaAuthenticationMiddleware(base handlers.HandlerBase, jwtVerifier JwtVerifier) func(http.Handler) http.Handler {
	middlewareFactory := oktaMiddlewareFactory{
		HandlerBase:       base,
		verifier:          jwtVerifier,
		jobCodeUser:       jobCodeUser,
		jobCodeAssessment: jobCodeAssessment,
		jobCodeMAC:        jobCodeMAC,
	}
	return middlewareFactory.newAuthenticationMiddleware
}
