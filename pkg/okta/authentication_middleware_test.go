package okta

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/handlers"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

type AuthenticationMiddlewareTestSuite struct {
	suite.Suite
	logger *zap.Logger
	config *viper.Viper
	store  *storage.Store
}

func TestAuthenticationMiddlewareTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()
	logger := zap.NewNop()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)

	store, _ := storage.NewStore(logger, NewDBConfig(), ldClient)

	testSuite := &AuthenticationMiddlewareTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		config: config,
		store:  store,
	}

	suite.Run(t, testSuite)
}

func validJwt() *jwtverifier.Jwt {
	return &jwtverifier.Jwt{
		Claims: map[string]interface{}{
			"mint-groups": []string{},
			"sub":         "EASI",
			"iss":         "www.fake.com",
		},
	}
}

type TestJwtVerifier struct {
	verify func(jwt string) (*jwtverifier.Jwt, error)
}

func (tjv TestJwtVerifier) VerifyAccessToken(jwt string) (*jwtverifier.Jwt, error) {
	return tjv.verify(jwt)
}

func (s *AuthenticationMiddlewareTestSuite) buildMiddleware(verify func(jwt string) (*jwtverifier.Jwt, error)) func(http.Handler) http.Handler {
	verifier := TestJwtVerifier{
		verify: verify,
	}

	// Create dummy LD Client for use in the middleware factory
	testData := ldtestdata.DataSource()
	testData.Update(testData.Flag(flags.DowngradeAssessmentTeamKey).BooleanFlag().VariationForAll(false))
	ldConfig := ld.Config{
		DataSource: testData,
	}
	ldClient, err := ld.MakeCustomClient("fake", ldConfig, 0)
	s.NoError(err)

	factory := NewMiddlewareFactory(
		handlers.NewHandlerBase(s.logger),
		verifier,
		s.store,
		true,
		ldClient,
	)
	return factory.NewAuthenticationMiddleware
}

func (s *AuthenticationMiddlewareTestSuite) TestAuthorizeMiddleware() {

	_, err := userhelpers.GetOrCreateUserAccount(context.Background(), s.store, "EASI", true, false, userhelpers.GetUserInfoFromOktaLocal)

	s.NoError(err)

	s.Run("a valid token sets the principal", func() {
		authMiddleware := s.buildMiddleware(func(jwt string) (*jwtverifier.Jwt, error) {
			s.Equal("abcdefg", jwt)
			return validJwt(), nil
		})

		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", "Bearer abcdefg")
		rr := httptest.NewRecorder()

		handlerRun := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true

			principal := appcontext.Principal(r.Context())
			s.NotEqual(authentication.ANON, principal)
			s.Equal("EASI", principal.ID())
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
	})

	s.Run("an invalid token does not execute the handler", func() {
		authMiddleware := s.buildMiddleware(func(jwt string) (*jwtverifier.Jwt, error) {
			return nil, errors.New("invalid token")
		})

		req := httptest.NewRequest("GET", "/systems/", nil)
		req.Header.Set("AUTHORIZATION", "Bearer isNotABear")
		rr := httptest.NewRecorder()

		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			s.Fail("handler should not be run")
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)
	})

	s.Run("allows requests without a token to be executed", func() {
		authMiddleware := s.buildMiddleware(func(jwt string) (*jwtverifier.Jwt, error) {
			s.FailNow("there should be no verification without a token")
			return nil, nil
		})

		req := httptest.NewRequest("GET", "/systems/", nil)
		rr := httptest.NewRecorder()

		handlerRun := false
		testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlerRun = true
		})

		authMiddleware(testHandler).ServeHTTP(rr, req)

		s.True(handlerRun)
	})

}

func TestJobCodes(t *testing.T) {
	payload := `
	{
		"sub":"NASA",
		"mint-groups":[
			"EX_SPACE",
			"EX_HOUSTON",
			"EX_MARS"
		]
	}
	`
	claims := map[string]interface{}{}
	if err := json.Unmarshal([]byte(payload), &claims); err != nil {
		t.Fatalf("incorrect data: %v\n", err)
	}
	jwt := &jwtverifier.Jwt{Claims: claims}

	testCases := map[string]struct {
		jobCode  string
		expected bool
	}{
		"success": {
			jobCode:  "EX_HOUSTON",
			expected: true,
		},
		"failure": {
			jobCode:  "MARIANA_TRENCH",
			expected: false,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			result := jwtGroupsContainsJobCode(jwt, tc.jobCode)
			assert.Equal(t, tc.expected, result)
		})
	}
}

// NewDBConfig returns a DBConfig struct with values from appconfig
func NewDBConfig() storage.DBConfig {
	config := testhelpers.NewConfig()

	return storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
}
