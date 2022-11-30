package okta

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/handlers"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

const (
	jobCodeUser       = "MINT_USER_NONPROD"
	jobCodeAssessment = "MINT_ASSESSMENT_NONPROD"
	jobCodeMAC        = "MINT MAC Users"
)

// EnhancedJwt is the JWT and the auth token
type EnhancedJwt struct {
	JWT       *jwtverifier.Jwt
	AuthToken string
}

func (f MiddlewareFactory) jwt(logger *zap.Logger, authHeader string) (*EnhancedJwt, error) {
	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return nil, errors.New("invalid Bearer in auth header")
	}
	bearerToken := tokenParts[1]
	if bearerToken == "" {
		return nil, errors.New("empty bearer value")
	}

	jwt, err := f.verifier.VerifyAccessToken(bearerToken)
	enhanced := EnhancedJwt{
		JWT:       jwt,
		AuthToken: bearerToken,
	}
	return &enhanced, err
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

func (f MiddlewareFactory) newPrincipal(enchanced *EnhancedJwt) (*authentication.OKTAPrincipal, error) {
	euaID := enchanced.JWT.Claims["sub"].(string)
	if euaID == "" {
		return nil, errors.New("unable to retrieve EUA ID from JWT")
	}

	baseURL := enchanced.JWT.Claims["iss"].(string) // the base url for user info endpoint

	// the current assumption is that anyone with an appropriate
	// JWT provided by Okta for MINT is allowed to use MINT
	// as a viewer/submitter
	jcUser := jwtGroupsContainsJobCode(enchanced.JWT, f.jobCodeUser)

	// need to check the claims for empowerment as each role6
	jcAssessment := jwtGroupsContainsJobCode(enchanced.JWT, f.jobCodeAssessment)

	jcMAC := jwtGroupsContainsJobCode(enchanced.JWT, f.jobCodeMAC)

	userAccount, err := userhelpers.GetOrCreateUserAccount(f.Store, euaID, false, baseURL, enchanced.AuthToken, jcMAC) //TODO, do we need to do anything with the user? Should we pass the id around?
	if err != nil {
		return nil, err
	}

	return &authentication.OKTAPrincipal{
		Username:          strings.ToUpper(euaID),
		JobCodeUSER:       jcUser,
		JobCodeASSESSMENT: jcAssessment,
		JobCodeMAC:        jcMAC,
		UserAccount:       userAccount,
	}, nil
}

// NewAuthenticationMiddleware returns an authentication middleware function to parse a JWT and attach an appropriate principal object to the context
func (f MiddlewareFactory) NewAuthenticationMiddleware(next http.Handler) http.Handler {
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

// MiddlewareFactory provides functionality to create functions that attach EUA Principals to context objects by decoding JWT tokens
type MiddlewareFactory struct {
	handlers.HandlerBase
	Store             *storage.Store
	verifier          JwtVerifier
	jobCodeUser       string
	jobCodeAssessment string
	jobCodeMAC        string
}

// NewOktaWebSocketAuthenticationMiddleware returns a transport.WebsocketInitFunc that uses the `authToken` in
// the websocket connection payload to authenticate an Okta user.
func (f MiddlewareFactory) NewOktaWebSocketAuthenticationMiddleware(logger *zap.Logger) transport.WebsocketInitFunc {
	return func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
		// Get the token from payload
		all := initPayload
		fmt.Println("ALL OF EM BABY (OKTA)", all)
		any := initPayload["authToken"]
		token, ok := any.(string)
		if !ok || token == "" {
			return nil, errors.New("authToken not found in transport payload")
		}

		// Parse auth header into JWT object
		jwt, err := f.jwt(logger, token)
		if err != nil {
			fmt.Println("ERROR PARSING JWT", err)
			// TODO How to error handle here?
		}

		// devCtx, err := devUserContext(ctx, token)
		principal, err := f.newPrincipal(jwt)
		if err != nil {
			logger.Error("could not set context for okta auth", zap.Error(err))
			return nil, err
		}

		oktaCtx := appcontext.WithPrincipal(ctx, principal)

		return oktaCtx, nil
	}
}

// NewMiddlewareFactory returns a factory creating Okta middleware functions
func NewMiddlewareFactory(base handlers.HandlerBase, jwtVerifier JwtVerifier, store *storage.Store) *MiddlewareFactory {
	return &MiddlewareFactory{
		HandlerBase:       base,
		Store:             store,
		verifier:          jwtVerifier,
		jobCodeUser:       jobCodeUser,
		jobCodeAssessment: jobCodeAssessment,
		jobCodeMAC:        jobCodeMAC,
	}
}
