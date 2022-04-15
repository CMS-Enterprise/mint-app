package resolvers

import (
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

func TestCreatePlanBasicsResolver(t *testing.T) {

	tc := GetDefaultTestConfigs()

	basics := models.PlanBasics{}

	result, err := CreatePlanBasicsResolver(tc.Logger, &basics, tc.Principal, tc.Store)
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
