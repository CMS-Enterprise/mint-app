package resolvers

import (
	"testing"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

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

func TestCreatePlanBasicsResolver(t *testing.T) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	input := model.PlanBasicsInput{}
	principal := "NOT_ASSIGNED" //Violates EUAD domain

	store, err := storage.NewStore(logger, config, ldClient)
	assert.NoError(t, err)

	result, err := CreatePlanBasicsResolver(logger, input, &principal, store)
	assert.NoError(t, err)
	assert.NotNil(t, result.ID)
}

func TestFetchPlanBasicsByID(t *testing.T) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	id := uuid.Nil
	store, _ := storage.NewStore(logger, config, ldClient)

	plan, err := FetchPlanBasicsByID(logger, id, store)
	assert.Nil(t, err)
	assert.NotNil(t, plan)
}
