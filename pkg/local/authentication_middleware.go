package local

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-openapi/swag"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

// DevUserConfig is the set of values that can be passed in a request header
type DevUserConfig struct {
	EUA      string   `json:"euaId"`
	JobCodes []string `json:"jobCodes"`
}

func authenticateMiddleware(logger *zap.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Using local authorization middleware")

		if len(r.Header["Authorization"]) == 0 {
			logger.Info("No local auth header present")
			next.ServeHTTP(w, r)
			return
		}

		// don't attempt to handle local auth if the Authorization Header doesn't start with "Local"
		if !strings.HasPrefix(r.Header["Authorization"][0], "Local") {
			next.ServeHTTP(w, r)
			return
		}

		tokenParts := strings.Split(r.Header["Authorization"][0], "Local ")
		if len(tokenParts) < 2 {
			logger.Error("Invalid local auth header")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		devUserConfigJSON := tokenParts[1]
		if devUserConfigJSON == "" {
			logger.Error("Empty dev user config JSON")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		config := DevUserConfig{}

		if parseErr := json.Unmarshal([]byte(devUserConfigJSON), &config); parseErr != nil {
			logger.Error("Could not parse local auth JSON")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		logger.Info("Using local authorization middleware and populating EUA ID and job codes")
		ctx := appcontext.WithPrincipal(r.Context(), &authentication.EUAPrincipal{
			EUAID:             config.EUA,
			JobCodeUSER:       swag.ContainsStrings(config.JobCodes, "MINT_USER"),
			JobCodeASSESSMENT: swag.ContainsStrings(config.JobCodes, "MINT_ASSESSMENT"),
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewLocalAuthenticationMiddleware stubs out context info for local (non-Okta) authentication
func NewLocalAuthenticationMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return authenticateMiddleware(logger, next)
	}
}
