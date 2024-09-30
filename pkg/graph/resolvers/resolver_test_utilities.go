package resolvers

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/viper"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/local"
	"github.com/cms-enterprise/mint-app/pkg/oktaapi"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/s3testconfigs"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub"

	ld "github.com/launchdarkly/go-server-sdk/v6"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/testhelpers"
)

// TestConfigs is a struct that contains all the dependencies needed to run a test
type TestConfigs struct {
	DBConfig       storage.DBConfig
	LDClient       *ld.LDClient
	Logger         *zap.Logger
	UserInfo       *models.UserInfo
	Store          *storage.Store
	S3Client       *s3.S3Client
	EChimpS3Client *s3.S3Client
	PubSub         *pubsub.ServicePubSub
	Principal      *authentication.ApplicationPrincipal
	Context        context.Context
	OktaClient     oktaapi.Client
	viperConfig    *viper.Viper
}

// GetDefaultTestConfigs returns a TestConfigs struct with all the dependencies needed to run a test
// Note, it does not return the principal as this needs to be updated for every test. This should only be called from setup tests!
func GetDefaultTestConfigs() *TestConfigs {
	tc := TestConfigs{}
	tc.GetDefaults()
	return &tc
}

func createS3Client(viperConfig *viper.Viper) s3.S3Client {

	s3Cfg := s3.Config{
		Bucket:  viperConfig.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  viperConfig.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}
	//OS GetEnv(called in NewS3Client ) won't get environment variables set by VSCODE for debugging. Set here for testing
	_ = os.Setenv(appconfig.LocalMinioAddressKey, viperConfig.GetString(appconfig.LocalMinioAddressKey))
	_ = os.Setenv(appconfig.LocalMinioS3AccessKey, viperConfig.GetString(appconfig.LocalMinioS3AccessKey))
	_ = os.Setenv(appconfig.LocalMinioS3SecretKey, viperConfig.GetString(appconfig.LocalMinioS3SecretKey))

	return s3.NewS3Client(s3Cfg)
}

// GetDefaults sets the dependencies for the TestConfigs struct
// The principal needs to be set before every test as the user account is removed between tests
func (tc *TestConfigs) GetDefaults() {
	config, ldClient, logger, userInfo, ps := getTestDependencies()
	store, _ := storage.NewStore(config, ldClient)

	viperConfig := testhelpers.NewConfig()

	s3Client := createS3Client(viperConfig)
	eChimpS3Client := s3testconfigs.S3TestECHIMPClient(viperConfig)
	tc.DBConfig = config
	tc.LDClient = ldClient
	tc.Logger = logger
	tc.UserInfo = userInfo
	tc.Store = store
	tc.S3Client = &s3Client
	tc.EChimpS3Client = &eChimpS3Client
	tc.PubSub = ps
	tc.viperConfig = viperConfig

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

	return createTemplateCacheHelperWithInputTemplates(
		planName,
		plan,
		"{{.ModelName}}'s Test",
		"{{.ModelName}} {{.ModelID}}")
}

func createTemplateCacheHelperWithInputTemplates(
	planName string,
	plan *models.ModelPlan,
	subject string,
	body string) (*emailtemplates.EmailTemplate, string, string) {
	templateCache := emailtemplates.NewTemplateCache()
	_ = templateCache.LoadTextTemplateFromString("testSubject", subject)
	_ = templateCache.LoadHTMLTemplateFromString("testBody", body, nil)
	testTemplate := emailtemplates.NewEmailTemplate(
		templateCache,
		"testSubject",
		"testBody",
	)

	expectedSubject := fmt.Sprintf("%s's Test", planName)
	expectedBody := fmt.Sprintf("%s %s", planName, plan.ID.String())
	return testTemplate, expectedSubject, expectedBody
}
