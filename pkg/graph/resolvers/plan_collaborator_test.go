package resolvers

// import (
// 	"testing"

// 	"github.com/cmsgov/mint-app/pkg/models"

// 	"github.com/google/uuid"
// 	_ "github.com/lib/pq" // required for postgres driver in sql
// 	"github.com/stretchr/testify/assert"
// )

// func makeTestCollaborator() models.PlanCollaborator {
// 	return models.PlanCollaborator{
// 		FullName:    "Fake name",
// 		EUAUserID:   "FAKE",
// 		CreatedBy:   models.StringPointer("FAKE"),
// 		ID:          uuid.MustParse("f85c15cd-f920-4080-bdeb-e79b3d8f056a"),
// 		ModelPlanID: uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48"),
// 		TeamRole:    models.TeamRoleLearning,
// 	}
// }
// func TestCreatePlanCollaborator(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	colab := makeTestCollaborator()

// 	result, err := CreatePlanCollaborator(tc.Logger, &colab, colab.CreatedBy, tc.Store)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)
// }

// func TestUpdatePlanCollaborator(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	colab := makeTestCollaborator()
// 	colab.TeamRole = models.TeamRoleModelTeam

// 	result, err := UpdatePlanCollaborator(tc.Logger, &colab, colab.CreatedBy, tc.Store)

// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)
// 	assert.EqualValues(t, result.TeamRole, colab.TeamRole)

// }

// func TestFetchCollaboratorsByModelPlanID(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	modelPlanID := uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")

// 	result, err := FetchCollaboratorsByModelPlanID(tc.Logger, tc.Principal, modelPlanID, tc.Store)
// 	assert.NoError(t, err)

// 	assert.NotNil(t, result)

// }

// func TestDeletePlanCollaborator(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	collabDel := makeTestCollaborator()

// 	dRes, err := DeletePlanCollaborator(tc.Logger, &collabDel, tc.Principal, tc.Store)
// 	assert.NoError(t, err)

// 	assert.NotNil(t, dRes)

// 	modelPlanID := uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")

// 	result, err := FetchCollaboratorsByModelPlanID(tc.Logger, tc.Principal, modelPlanID, tc.Store)
// 	assert.NoError(t, err)

// 	assert.NotNil(t, result)

// 	modelLead := result[0]

// 	_, err2 := DeletePlanCollaborator(tc.Logger, modelLead, tc.Principal, tc.Store) //this is the last model lead, deleting will cause error
// 	assert.Error(t, err2)

// }
