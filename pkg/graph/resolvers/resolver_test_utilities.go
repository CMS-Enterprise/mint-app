package resolvers

import (
	"context"
	"fmt"
	"os"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/local"
	"github.com/cmsgov/mint-app/pkg/oktaapi"
	"github.com/cmsgov/mint-app/pkg/shared/emailtemplates"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

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
	DBConfig   storage.DBConfig
	LDClient   *ld.LDClient
	Logger     *zap.Logger
	UserInfo   *models.UserInfo
	Store      *storage.Store
	S3Client   *upload.S3Client
	PubSub     *pubsub.ServicePubSub
	Principal  *authentication.ApplicationPrincipal
	Context    context.Context
	OktaClient oktaapi.Client
}

// GetDefaultTestConfigs returns a TestConfigs struct with all the dependencies needed to run a test
// Note, it does not return the principal as this needs to be updated for every test. This should only be called from setup tests!
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

// GetDefaults sets the dependencies for the TestConfigs struct
// The principal needs to be set before every test as the user account is removed between tests
func (tc *TestConfigs) GetDefaults() {
	config, ldClient, logger, userInfo, ps := getTestDependencies()
	store, _ := storage.NewStore(config, ldClient)

	s3Client := createS3Client()
	tc.DBConfig = config
	tc.LDClient = ldClient
	tc.Logger = logger
	tc.UserInfo = userInfo
	tc.Store = store
	tc.S3Client = &s3Client
	tc.PubSub = ps

	oktaClient, oktaClientErr := local.NewOktaAPIClient()
	if oktaClientErr != nil {
		logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
	}
	tc.OktaClient = oktaClient

	dataLoaders := loaders.NewDataLoaders(tc.Store)
	tc.Context = loaders.CTXWithLoaders(context.Background(), dataLoaders)
	tc.Context = appcontext.WithLogger(tc.Context, tc.Logger)
	tc.Context = appcontext.WithUserAccountService(tc.Context, userhelpers.UserAccountGetByIDLOADER)

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

func createTemplateCacheHelper(
	planName string,
	plan *models.ModelPlan) (*emailtemplates.EmailTemplate, string, string) {
	templateCache := emailtemplates.NewTemplateCache()
	_ = templateCache.LoadTextTemplateFromString("testSubject", "{{.ModelName}}'s Test")
	_ = templateCache.LoadHTMLTemplateFromString("testBody", "{{.ModelName}} {{.ModelID}}", nil)
	testTemplate := emailtemplates.NewEmailTemplate(
		templateCache,
		"testSubject",
		"testBody",
	)

	expectedSubject := fmt.Sprintf("%s's Test", planName)
	expectedBody := fmt.Sprintf("%s %s", planName, plan.ID.String())
	return testTemplate, expectedSubject, expectedBody
}
