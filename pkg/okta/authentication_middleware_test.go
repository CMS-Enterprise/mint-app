package okta

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	ld "github.com/launchdarkly/go-server-sdk/v6"
	"github.com/launchdarkly/go-server-sdk/v6/testhelpers/ldtestdata"
	jwtverifier "github.com/okta/okta-jwt-verifier-golang"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/flags"
	"github.com/cms-enterprise/mint-app/pkg/handlers"
	"github.com/cms-enterprise/mint-app/pkg/local"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/testhelpers"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

type AuthenticationMiddlewareTestSuite struct {
	suite.Suite
	logger        *zap.Logger
	config        *viper.Viper
	store         *storage.Store
	FetchUserInfo func(context.Context, string) (*models.UserInfo, error)
}

func TestAuthenticationMiddlewareTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()
	logger := zap.NewNop()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)

	store, _ := storage.NewStore(NewDBConfig(), ldClient)

	oktaClient, oktaClientErr := local.NewOktaAPIClient()
	if oktaClientErr != nil {
		logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
	}

	testSuite := &AuthenticationMiddlewareTestSuite{
		Suite:         suite.Suite{},
		logger:        logger,
		config:        config,
		store:         store,
		FetchUserInfo: oktaClient.FetchUserInfo,
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

func (s *AuthenticationMiddlewareTestSuite) buildMiddleWareFactory(verify func(jwt string) (*jwtverifier.Jwt, error)) *MiddlewareFactory {
	verifier := TestJwtVerifier{
		verify: verify,
	}

	// Create dummy LD Client for use in the middleware factory
	testData := ldtestdata.DataSource()
	testData.Update(testData.Flag(flags.DowngradeAssessmentTeamKey).BooleanFlag().VariationForAll(false))
	testData.Update(testData.Flag(flags.DowngradeNonCMSKey).BooleanFlag().VariationForAll(false))
	ldConfig := ld.Config{
		DataSource: testData,
	}
	ldClient, err := ld.MakeCustomClient("fake", ldConfig, 0)
	s.NoError(err)
	factory := NewMiddlewareFactory(
		handlers.NewHandlerBase(),
		verifier,
		s.store,
		true,
		ldClient,
	)
	return factory

}

func (s *AuthenticationMiddlewareTestSuite) buildMiddleware(verify func(jwt string) (*jwtverifier.Jwt, error)) func(http.Handler) http.Handler {
	factory := s.buildMiddleWareFactory(verify)
	return factory.NewAuthenticationMiddleware
}

func (s *AuthenticationMiddlewareTestSuite) TestAuthorizeMiddleware() {
	userhelpers.GetUserInfoAccountInfoWrapperFunc(s.FetchUserInfo)
	_, err := userhelpers.GetOrCreateUserAccount(context.Background(), s.store, s.store, "EASI", true, false, userhelpers.GetUserInfoAccountInfoWrapperFunc(s.FetchUserInfo))

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
func (s *AuthenticationMiddlewareTestSuite) TestNewPrincipal() {
	s.Run("Assessment has user permissions", func() {
		faktory := s.buildMiddleWareFactory(func(jwt string) (*jwtverifier.Jwt, error) {
			return nil, errors.New("invalid token")
		})
		jwt := validJwt()
		jwt.Claims["mint-groups"] = []interface{}{"MINT_ASSESSMENT_NONPROD"}

		eJwt := authentication.EnhancedJwt{
			JWT:       jwt,
			AuthToken: "Bearer isNotABear",
		}
		ctx := appcontext.WithEnhancedJWT(context.Background(), eJwt)
		princ, err := faktory.newPrincipal(ctx)
		s.NoError(err)
		s.True(princ.JobCodeUSER)
		s.True(princ.JobCodeASSESSMENT)
		s.False(princ.JobCodeMAC)
		s.False(princ.JobCodeNonCMS)
	})

	s.Run("Non-CMS has base user permissions without needing base user job code", func() {
		faktory := s.buildMiddleWareFactory(func(jwt string) (*jwtverifier.Jwt, error) {
			return nil, errors.New("invalid token")
		})
		jwt := validJwt()
		jwt.Claims["mint-groups"] = []interface{}{"MINT_NON_CMS_NONPROD"}

		eJwt := authentication.EnhancedJwt{
			JWT:       jwt,
			AuthToken: "Bearer isNotABear",
		}
		ctx := appcontext.WithEnhancedJWT(context.Background(), eJwt)
		princ, err := faktory.newPrincipal(ctx)
		s.NoError(err)
		s.True(princ.JobCodeUSER)
		s.False(princ.JobCodeASSESSMENT)
		s.False(princ.JobCodeMAC)
		s.True(princ.JobCodeNonCMS)
	})

	s.Run("User only have USER assessment permissions", func() {
		faktory := s.buildMiddleWareFactory(func(jwt string) (*jwtverifier.Jwt, error) {
			return nil, errors.New("invalid token")
		})
		jwt := validJwt()
		jwt.Claims["mint-groups"] = []interface{}{"MINT_USER_NONPROD"}

		eJwt := authentication.EnhancedJwt{
			JWT:       jwt,
			AuthToken: "Bearer isNotABear",
		}
		ctx := appcontext.WithEnhancedJWT(context.Background(), eJwt)
		princ, err := faktory.newPrincipal(ctx)
		s.NoError(err)
		s.True(princ.JobCodeUSER)
		s.False(princ.JobCodeASSESSMENT)
		s.False(princ.JobCodeMAC)
	})
	s.Run("MAC users only have MAC permissions", func() {
		faktory := s.buildMiddleWareFactory(func(jwt string) (*jwtverifier.Jwt, error) {
			return nil, errors.New("invalid token")
		})
		jwt := validJwt()
		jwt.Claims["mint-groups"] = []interface{}{"MINT MAC Users"}

		eJwt := authentication.EnhancedJwt{
			JWT:       jwt,
			AuthToken: "Bearer isNotABear",
		}
		ctx := appcontext.WithEnhancedJWT(context.Background(), eJwt)
		princ, err := faktory.newPrincipal(ctx)
		s.NoError(err)
		s.False(princ.JobCodeUSER)
		s.False(princ.JobCodeASSESSMENT)
		s.True(princ.JobCodeMAC)
	})
	s.Run("MINT_CONTRACTOR_FFS users only have MAC permissions", func() {
		faktory := s.buildMiddleWareFactory(func(jwt string) (*jwtverifier.Jwt, error) {
			return nil, errors.New("invalid token")
		})
		jwt := validJwt()
		jwt.Claims["mint-groups"] = []interface{}{"MINT_CTR_FFS_NONPROD"}

		eJwt := authentication.EnhancedJwt{
			JWT:       jwt,
			AuthToken: "Bearer isNotABear",
		}
		ctx := appcontext.WithEnhancedJWT(context.Background(), eJwt)
		princ, err := faktory.newPrincipal(ctx)
		s.NoError(err)
		s.False(princ.JobCodeUSER)
		s.False(princ.JobCodeASSESSMENT)
		s.True(princ.JobCodeMAC)
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
