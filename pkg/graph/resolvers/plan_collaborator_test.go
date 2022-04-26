package resolvers

import (
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"

	"github.com/google/uuid"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
)

func MakeTestCollaborator() models.PlanCollaborator {
	return models.PlanCollaborator{
		FullName:    "Fake name",
		EUAUserID:   "FAKE",
		CreatedBy:   models.StringPointer("FAKE"),
		ModifiedBy:  models.StringPointer("FAKE"),
		ID:          uuid.MustParse("f85c15cd-f920-4080-bdeb-e79b3d8f056a"),
		ModelPlanID: uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48"),
		TeamRole:    models.TeamRoleLearning,
	}
}
func TestCreatePlanCollaborator(t *testing.T) {
	tc := GetDefaultTestConfigs()
	colab := models.PlanCollaborator{
		FullName:    "Fake name",
		EUAUserID:   "FAKE",
		CreatedBy:   models.StringPointer("FAKE"),
		ModifiedBy:  models.StringPointer("FAKE"),
		ID:          uuid.MustParse("f85c15cd-f920-4080-bdeb-e79b3d8f056a"),
		ModelPlanID: uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48"),
		TeamRole:    models.TeamRoleLearning,
	}

	result, err := CreatePlanCollaborator(tc.Logger, &colab, colab.CreatedBy, tc.Store)
	assert.NoError(t, err)
	assert.NotNil(t, result.ID)
}

func TestUpdatePlanCollaborator(t *testing.T) {
	tc := GetDefaultTestConfigs()

	colab := models.PlanCollaborator{
		FullName:    "Fake name",
		EUAUserID:   "FAKE",
		CreatedBy:   models.StringPointer("FAKE"),
		ModifiedBy:  models.StringPointer("FAKE"),
		ID:          uuid.MustParse("f85c15cd-f920-4080-bdeb-e79b3d8f056a"),
		ModelPlanID: uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48"),
		TeamRole:    models.TeamRoleLearning,
	}

	result, err := UpdatePlanCollaborator(tc.Logger, &colab, colab.CreatedBy, tc.Store)

	assert.NoError(t, err)
	assert.NotNil(t, result.ID)
	//TODO MAKE A CHANGE and assert, use the common method
	// assert.EqualValues(t, result.CMSCenter, colab.CMSCenter)

}

func TestFetchCollaboratorsByModelPlanID(t *testing.T) {
	tc := GetDefaultTestConfigs()
	modelPlanID := uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")

	result, err := FetchCollaboratorsByModelPlanID(tc.Logger, tc.Principal, modelPlanID, tc.Store)
	assert.NoError(t, err)

	assert.NotNil(t, result)

}

//TODO add test to make sure you can't delete the last model lead when logic is added
// func TestDeletePlanCollaborator(t *testing.T) {
// 	tc := GetDefaultTestConfigs()

// }
