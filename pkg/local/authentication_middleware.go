package local

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/go-openapi/swag"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

// DevUserConfig is the set of values that can be passed in a request header
type DevUserConfig struct {
	EUA      string   `json:"euaId"`
	JobCodes []string `json:"jobCodes"`
}

func authenticateMiddleware(next http.Handler, store *storage.Store) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger := appcontext.ZLogger(r.Context())
		logger.Info("Using local authorization middleware")

		if len(r.Header["Authorization"]) == 0 {
			logger.Info("No local auth header present")
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header["Authorization"][0]
		ctx, err := devUserContext(r.Context(), authHeader, store)
		if err != nil {
			logger.Error("Empty dev user config JSON")
			w.WriteHeader(http.StatusBadRequest)
			next.ServeHTTP(w, r)
			return
		}
		if ctx == nil {
			logger.Info("No local auth header present")
			next.ServeHTTP(w, r)
			return
		}

		logger.Info("Using local authorization middleware and populating EUA ID and job codes")
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func devUserContext(ctx context.Context, authHeader string, store *storage.Store) (context.Context, error) {
	// don't attempt to handle local auth if the Authorization Header doesn't start with "Local"
	if !strings.HasPrefix(authHeader, "Local") {
		return ctx, nil
	}

	tokenParts := strings.Split(authHeader, "Local ")
	if len(tokenParts) < 2 {
		return nil, errors.New("invalid local auth header")
	}

	devUserConfigJSON := tokenParts[1]
	if devUserConfigJSON == "" {
		return nil, errors.New("empty dev user config JSON")
	}

	config := DevUserConfig{}

	if parseErr := json.Unmarshal([]byte(devUserConfigJSON), &config); parseErr != nil {
		return nil, errors.New("could not parse local auth JSON")
	}

	// Pull job codes from config
	// NOTE: We only allow nonprod job codes here. This is reflected in src/views/AuthenticationWrapper/DevLogin.tsx only pulling nonprod job codes
	jcUser := swag.ContainsStrings(config.JobCodes, "MINT_USER_NONPROD")
	jcAssessment := swag.ContainsStrings(config.JobCodes, "MINT_ASSESSMENT_NONPROD")
	jcMAC := (swag.ContainsStrings(config.JobCodes, "MINT MAC Users") || swag.ContainsStrings(config.JobCodes, "MINT_CTR_FFS_NONPROD"))
	jcNonCMS := swag.ContainsStrings(config.JobCodes, "MINT_NON_CMS_NONPROD")

	// Always set assessment users OR non CMS users to have base user permissions
	if jcAssessment || jcNonCMS {
		jcUser = true
	}

	princ := &authentication.ApplicationPrincipal{
		Username:          strings.ToUpper(config.EUA),
		JobCodeUSER:       jcUser,
		JobCodeASSESSMENT: jcAssessment,
		JobCodeMAC:        jcMAC,
		JobCodeNonCMS:     jcNonCMS,
	}
	oktaClient, oktaClientErr := NewOktaAPIClient()
	if oktaClientErr != nil {
		return nil, oktaClientErr
	}

	userhelpers.GetUserInfoAccountInfoWrapperFunc(oktaClient.FetchUserInfo)
	userAccount, err := userhelpers.GetOrCreateUserAccount(ctx, store, store, princ.ID(), true, princ.JobCodeMAC, userhelpers.GetUserInfoAccountInfoWrapperFunc(oktaClient.FetchUserInfo))
	if err != nil {
		return nil, err
	}
	princ.UserAccount = userAccount

	return appcontext.WithPrincipal(ctx, princ), nil
}

// NewLocalWebSocketAuthenticationMiddleware returns a transport.WebsocketInitFunc that uses the `authToken` in
// the websocket connection payload to authenticate a local user.
func NewLocalWebSocketAuthenticationMiddleware(store *storage.Store) transport.WebsocketInitFunc {
	return func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
		logger := appcontext.ZLogger(ctx)
		// Get the token from payload
		any := initPayload["authToken"]
		token, ok := any.(string)
		if !ok || token == "" {
			return nil, errors.New("authToken not found in transport payload")
		}

		devCtx, err := devUserContext(ctx, token, store)
		if err != nil {
			logger.Error("could not set context for local dev auth", zap.Error(err))
			return nil, err
		}

		return devCtx, nil
	}
}

// NewLocalAuthenticationMiddleware stubs out context info for local (non-Okta) authentication
func NewLocalAuthenticationMiddleware(store *storage.Store) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authenticateMiddleware(next, store)
	}
}
