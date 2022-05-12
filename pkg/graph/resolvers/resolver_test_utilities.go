package resolvers

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"

	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
)

// TestConfigs is a struct that contains all of the dependencies needed to run a test
type TestConfigs struct {
	DBConfig storage.DBConfig
	LDClient *ld.LDClient
	Logger   *zap.Logger
	UserInfo *models.UserInfo
	Store    *storage.Store
}

// GetDefaultTestConfigs returns a TestConfigs struct with all of the dependencies needed to run a test
func GetDefaultTestConfigs() *TestConfigs {
	tc := TestConfigs{}
	tc.GetDefaults()
	return &tc
}

// GetDefaults sets the dependencies for the TestConfigs struct
func (tc *TestConfigs) GetDefaults() {
	config, ldClient, logger, userInfo := getTestDependencies()
	store, _ := storage.NewStore(logger, config, ldClient)
	tc.DBConfig = config
	tc.LDClient = ldClient
	tc.Logger = logger
	tc.UserInfo = userInfo
	tc.Store = store
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

func getTestDependencies() (storage.DBConfig, *ld.LDClient, *zap.Logger, *models.UserInfo) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	userInfo := &models.UserInfo{
		CommonName: "Test User",
		Email:      "testuser@test.com",
		EuaUserID:  "TEST",
	}

	return config, ldClient, logger, userInfo

}

func createModelPlan(t *testing.T, tc *TestConfigs) *models.ModelPlan {
	mp, err := ModelPlanCreate(tc.Logger, "Test Plan", tc.Store, tc.UserInfo)
	assert.NoError(t, err)
	return mp
}

func createPlanDiscussion(t *testing.T, tc *TestConfigs, mp *models.ModelPlan, content string) *models.PlanDiscussion {
	input := &model.PlanDiscussionCreateInput{
		ModelPlanID: mp.ID,
		Content:     "This is a test comment",
	}
	pd, err := CreatePlanDiscussion(tc.Logger, input, tc.UserInfo.EuaUserID, tc.Store)
	assert.NoError(t, err)
	return pd
}

func createDiscussionReply(t *testing.T, tc *TestConfigs, pd *models.PlanDiscussion, content string, resolution bool) *models.DiscussionReply {
	input := &model.DiscussionReplyCreateInput{
		DiscussionID: pd.ID,
		Content:      content,
		Resolution:   resolution,
	}
	dr, err := CreateDiscussionReply(tc.Logger, input, tc.UserInfo.EuaUserID, tc.Store)
	assert.NoError(t, err)
	return dr
}
