package resolvers

import (
	"fmt"
	"testing"

	"github.com/cmsgov/mint-app/pkg/shared/emailTemplates"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/pubsub"
	"github.com/cmsgov/mint-app/pkg/upload"

	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
)

// TestConfigs is a struct that contains all the dependencies needed to run a test
type TestConfigs struct {
	DBConfig  storage.DBConfig
	LDClient  *ld.LDClient
	Logger    *zap.Logger
	UserInfo  *models.UserInfo
	Store     *storage.Store
	S3Client  *upload.S3Client
	PubSub    *pubsub.ServicePubSub
	Principal *authentication.EUAPrincipal
}

// GetDefaultTestConfigs returns a TestConfigs struct with all the dependencies needed to run a test
func GetDefaultTestConfigs(t *testing.T) *TestConfigs {
	tc := TestConfigs{}
	tc.GetDefaults(t)
	return &tc
}

func createS3Client() upload.S3Client {
	config := testhelpers.NewConfig()

	s3Cfg := upload.Config{
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}

	return upload.NewS3Client(s3Cfg)
}

// GetDefaults sets the dependencies for the TestConfigs struct
func (tc *TestConfigs) GetDefaults(t *testing.T) {
	config, ldClient, logger, userInfo, ps, princ := getTestDependencies()
	store, _ := storage.NewStore(logger, config, ldClient)

	// set up Email Template Service
	/*emailTemplateService, err := email.NewTemplateServiceImpl()
	if err != nil {
		panic(fmt.Sprintf("Failed to create an email template service: %v", zap.Error(err)))
	}*/

	// Set up Oddball email Service
	//emailServiceConfig := oddmail.GoSimpleMailServiceConfig{}
	//err = emailServiceConfig.LoadYAML("../../../config/test/emailServiceConfig.yaml")
	//if err != nil {
	//	panic(fmt.Sprintf("Failed to load an email service configuration: %v", zap.Error(err)))
	//}

	//var emailService *oddmail.GoSimpleMailService
	//emailService, err = oddmail.NewGoSimpleMailService(emailServiceConfig)
	//if err != nil {
	//	panic(fmt.Sprintf("Failed to create an email service: %v", zap.Error(err)))
	//}

	s3Client := createS3Client()
	tc.DBConfig = config
	tc.LDClient = ldClient
	tc.Logger = logger
	tc.UserInfo = userInfo
	tc.Store = store
	tc.S3Client = &s3Client
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

func createAddedAsCollaboratorTemplateCacheHelper(
	planName string,
	plan *models.ModelPlan) (*emailTemplates.EmailTemplate, string, string) {
	templateCache := emailTemplates.NewTemplateCache()
	_ = templateCache.LoadTemplateFromString("testSubject", "{{.ModelName}}")
	_ = templateCache.LoadTemplateFromString("testBody", "{{.ModelName}} {{.ModelID}}")
	testTemplate := emailTemplates.NewEmailTemplate(
		templateCache,
		"testSubject",
		"testBody",
	)

	expectedSubject := planName
	expectedBody := fmt.Sprintf("%s %s", planName, plan.ID.String())
	return testTemplate, expectedSubject, expectedBody
}
