package resolvers

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/shared/emailTemplates"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

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
	Principal *authentication.ApplicationPrincipal
}

// GetDefaultTestConfigs returns a TestConfigs struct with all the dependencies needed to run a test
func GetDefaultTestConfigs() *TestConfigs {
	tc := TestConfigs{}
	tc.GetDefaults()
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
func (tc *TestConfigs) GetDefaults() {
	config, ldClient, logger, userInfo, ps := getTestDependencies()
	store, _ := storage.NewStore(logger, config, ldClient)
	princ := getTestPrincipal(store, userInfo.EuaUserID)

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

func getTestDependencies() (storage.DBConfig, *ld.LDClient, *zap.Logger, *models.UserInfo, *pubsub.ServicePubSub) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	userInfo := &models.UserInfo{
		CommonName: "Test User",
		Email:      "testuser@test.com",
		EuaUserID:  "TEST",
	}
	ps := pubsub.NewServicePubSub()

	return config, ldClient, logger, userInfo, ps
}

func getTestPrincipal(store *storage.Store, userName string) *authentication.ApplicationPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), store, userName, true, false)

	princ := &authentication.ApplicationPrincipal{
		Username:          userName,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
		JobCodeMAC:        false,
		UserAccount:       userAccount,
	}
	return princ

}

func createAddedAsCollaboratorTemplateCacheHelper(
	planName string,
	plan *models.ModelPlan) (*emailTemplates.EmailTemplate, string, string) {
	templateCache := emailTemplates.NewTemplateCache()
	_ = templateCache.LoadTextTemplateFromString("testSubject", "{{.ModelName}}'s Test")
	_ = templateCache.LoadHTMLTemplateFromString("testBody", "{{.ModelName}} {{.ModelID}}")
	testTemplate := emailTemplates.NewEmailTemplate(
		templateCache,
		"testSubject",
		"testBody",
	)

	expectedSubject := fmt.Sprintf("%s's Test", planName)
	expectedBody := fmt.Sprintf("%s %s", planName, plan.ID.String())
	return testTemplate, expectedSubject, expectedBody
}
