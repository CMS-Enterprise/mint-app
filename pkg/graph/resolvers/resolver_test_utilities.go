package resolvers

import (
	"fmt"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/shared/pubsub"

	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
)

// TestConfigs is a struct that contains all the dependencies needed to run a test
type TestConfigs struct {
	DBConfig             storage.DBConfig
	LDClient             *ld.LDClient
	EmailService         oddmail.EmailService
	EmailTemplateService *email.TemplateService
	Logger               *zap.Logger
	UserInfo             *models.UserInfo
	Store                *storage.Store
	PubSub               *pubsub.ServicePubSub
	Principal            *authentication.EUAPrincipal
}

// GetDefaultTestConfigs returns a TestConfigs struct with all the dependencies needed to run a test
func GetDefaultTestConfigs() *TestConfigs {
	tc := TestConfigs{}
	tc.GetDefaults()
	return &tc
}

// GetDefaults sets the dependencies for the TestConfigs struct
func (tc *TestConfigs) GetDefaults() {
	config, ldClient, logger, userInfo, ps, princ := getTestDependencies()
	store, _ := storage.NewStore(logger, config, ldClient)

	// set up Email Template Service
	emailTemplateService, err := email.NewTemplateService()
	if err != nil {
		panic(fmt.Sprintf("Failed to create an email template service: %v", zap.Error(err)))
	}

	// Set up Oddball email Service
	emailServiceConfig := oddmail.GoSimpleMailServiceConfig{}
	err = emailServiceConfig.LoadYAML("../../config/data/emailServiceConfig.yaml")
	if err != nil {
		panic(fmt.Sprintf("Failed to load an email service configuration: %v", zap.Error(err)))
	}

	var emailService *oddmail.GoSimpleMailService
	emailService, err = oddmail.NewGoSimpleMailService(emailServiceConfig)
	if err != nil {
		panic(fmt.Sprintf("Failed to create an email service: %v", zap.Error(err)))
	}

	tc.DBConfig = config
	tc.LDClient = ldClient
	tc.EmailService = emailService
	tc.EmailTemplateService = emailTemplateService
	tc.Logger = logger
	tc.UserInfo = userInfo
	tc.Store = store
	tc.PubSub = ps

	tc.Principal = princ
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

func getTestDependencies() (storage.DBConfig, *ld.LDClient, *zap.Logger, *models.UserInfo, *pubsub.ServicePubSub, *authentication.EUAPrincipal) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	userInfo := &models.UserInfo{
		CommonName: "Test User",
		Email:      "testuser@test.com",
		EuaUserID:  "TEST",
	}
	ps := pubsub.NewServicePubSub()

	princ := &authentication.EUAPrincipal{
		EUAID:             userInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}

	return config, ldClient, logger, userInfo, ps, princ

}
