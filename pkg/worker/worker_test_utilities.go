package worker

import (
	"context"
	"os"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/local"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/pubsub"
	"github.com/cmsgov/mint-app/pkg/upload"

	ld "github.com/launchdarkly/go-server-sdk/v6"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
)

// TestConfigs is a struct that contains all the dependencies needed to run a test
type TestConfigs struct {
	DBConfig             storage.DBConfig
	LDClient             *ld.LDClient
	Logger               *zap.Logger
	UserInfo             *models.UserInfo
	Store                *storage.Store
	S3Client             *upload.S3Client
	PubSub               *pubsub.ServicePubSub
	Principal            *authentication.ApplicationPrincipal
	EmailTemplateService email.TemplateServiceImpl
	Context              context.Context
	FetchUserInfo        func(context.Context, string) (*models.UserInfo, error)
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
	//OS ENV won't get environment variables set by VSCODE for debugging
	_ = os.Setenv(appconfig.LocalMinioAddressKey, config.GetString(appconfig.LocalMinioAddressKey))
	_ = os.Setenv(appconfig.LocalMinioS3AccessKey, config.GetString(appconfig.LocalMinioS3AccessKey))
	_ = os.Setenv(appconfig.LocalMinioS3SecretKey, config.GetString(appconfig.LocalMinioS3SecretKey))

	return upload.NewS3Client(s3Cfg)
}

// GetDefaults sets the dependencies for the TestConfigs struct that will remain constant across the suite
// The principal needs to be set before every test as the user account is removed between tests
func (tc *TestConfigs) GetDefaults() {
	config, ldClient, logger, userInfo, ps := getTestDependencies()
	store, _ := storage.NewStore(config, ldClient)
	emailTemplateService, _ := email.NewTemplateServiceImpl()
	oktaClient, oktaClientErr := local.NewOktaAPIClient()
	if oktaClientErr != nil {
		logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
	}

	s3Client := createS3Client()
	tc.DBConfig = config
	tc.LDClient = ldClient
	tc.Logger = logger
	tc.UserInfo = userInfo
	tc.Store = store
	tc.S3Client = &s3Client
	tc.PubSub = ps
	tc.EmailTemplateService = *emailTemplateService
	tc.FetchUserInfo = oktaClient.FetchUserInfo

	dataLoaders := loaders.NewDataLoaders(tc.Store)
	tc.Context = loaders.CTXWithLoaders(context.Background(), dataLoaders)
	tc.Context = appcontext.WithLogger(tc.Context, tc.Logger)
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
		DisplayName: "Test User",
		FirstName:   "Test",
		LastName:    "User",
		Email:       "testuser@test.com",
		Username:    "TEST",
	}
	ps := pubsub.NewServicePubSub()

	return config, ldClient, logger, userInfo, ps
}
