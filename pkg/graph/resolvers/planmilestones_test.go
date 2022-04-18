package resolvers

import (
	"github.com/google/uuid"
	"testing"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/storage"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

func TestCreatePlanMilestonesResolver(t *testing.T) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	modelPlanID, err := uuid.Parse("1234")
	input := model.CreatePlanMilestonesRequest{
		ModelPlanID: modelPlanID,
	}
	principal := "NOT_ASSIGNED"

	store, err := storage.NewStore(logger, config, ldClient)
	assert.NoError(t, err)

	payload, err := CreatePlanMilestonesResolver(logger, input, principal, store)
	assert.NoError(t, err)

	assert.Equal(t, modelPlanID.String(), payload.ID.String())
}

func TestFetchPlanMilestonesByID(t *testing.T) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	id := uuid.Nil
	store, _ := storage.NewStore(logger, config, ldClient)

	plan, err := FetchPlanMilestonesByID(logger, id, store)
	assert.NoError(t, err)
	assert.NotNil(t, plan)
}
