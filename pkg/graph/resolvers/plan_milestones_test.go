package resolvers

import (
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/storage"
)

func TestCreatePlanMilestones(t *testing.T) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	principal := "FAKE"
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  principal,
	}

	store, err := storage.NewStore(logger, config, ldClient)
	assert.NoError(t, err)

	plan, err := ModelPlanCreate(logger, "FAKE", store, &principalInfo)
	assert.NoError(t, err)

	input := models.PlanMilestones{
		ModelPlanID: plan.ID,
	}
	milestones, err := CreatePlanMilestones(logger, &input, &principal, store)
	assert.NoError(t, err)
	assert.Equal(t, plan.ID.String(), milestones.GetPlanID().String())

	sqlResult, err := store.DeletePlanMilestonesByID(logger, milestones.ID)
	assert.NoError(t, err)

	rowsAffected, err := sqlResult.RowsAffected()
	assert.NoError(t, err)
	assert.Equal(t, 1, int(rowsAffected))

}

func TestFetchPlanMilestonesByID(t *testing.T) {
	config := NewDBConfig()
	ldClient, _ := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	logger := zap.NewNop()
	store, _ := storage.NewStore(logger, config, ldClient)
	principal := "FAKE"
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  principal,
	}

	plan, err := ModelPlanCreate(logger, "FAKE", store, &principalInfo)
	assert.NoError(t, err)

	input := models.PlanMilestones{
		ModelPlanID: plan.ID,
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
	assert.Equal(t, 1, int(rowsAffected))

}
