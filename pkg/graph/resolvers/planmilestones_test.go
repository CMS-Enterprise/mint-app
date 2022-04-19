package resolvers

import (
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"

	"github.com/google/uuid"

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
	modelPlanID, err := uuid.Parse("FAKE")
	input := models.PlanMilestones{
		ModelPlanID: modelPlanID,
	}
	principal := "FAKE"

	store, err := storage.NewStore(logger, config, ldClient)
	assert.NoError(t, err)

	payload, err := CreatePlanMilestones(logger, &input, &principal, store)
	assert.NoError(t, err)

	assert.Equal(t, modelPlanID.String(), payload.ID.String())
}

func TestFetchPlanMilestonesByID(t *testing.T) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	store, _ := storage.NewStore(logger, config, ldClient)
	principal := "FAKE"
	modelPlanID, _ := uuid.Parse("FAKE")
	input := models.PlanMilestones{
		ModelPlanID: modelPlanID,
	}

	payload, err := CreatePlanMilestones(logger, &input, &principal, store)
	assert.NoError(t, err)

	milestones, err := FetchPlanMilestonesByID(logger, payload.ID, store)
	assert.NoError(t, err)
	assert.NotNil(t, milestones)

	sqlResult, err := store.DeletePlanMilestonesByID(logger, milestones.ID)
	assert.NoError(t, err)

	rowsAffected, err := sqlResult.RowsAffected()
	assert.NoError(t, err)
	assert.Equal(t, 1, rowsAffected)
}
