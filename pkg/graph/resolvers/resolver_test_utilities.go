package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/appconfig"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

type TestConfigs struct {
	DBConfig  storage.DBConfig
	LDClient  *ld.LDClient
	Logger    *zap.Logger
	Principal *string
	Store     *storage.Store
}

func GetDefaultTestConfigs() *TestConfigs {
	tc := TestConfigs{}
	tc.GetDefaults()
	return &tc
}

func (tc *TestConfigs) GetDefaults() {
	config, ldClient, logger, principal := getTestDependencies()
	store, _ := storage.NewStore(logger, config, ldClient)
	tc.DBConfig = config
	tc.LDClient = ldClient
	tc.Logger = logger
	tc.Principal = principal
	tc.Store = store
}

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
func getTestDependencies() (storage.DBConfig, *ld.LDClient, *zap.Logger, *string) {

	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	principal := "TEST"

	return config, ldClient, logger, &principal

}
