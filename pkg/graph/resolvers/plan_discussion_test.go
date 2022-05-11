package resolvers

// import (
// 	"testing"

// 	"github.com/cmsgov/mint-app/pkg/models"

// 	"github.com/google/uuid"
// 	_ "github.com/lib/pq" // required for postgres driver in sql
// 	"github.com/stretchr/testify/assert"
// )

// func makeTestDiscussion() models.PlanDiscussion {
// 	return models.PlanDiscussion{
// 		ID:          uuid.MustParse("89e137b8-59cb-4281-98d4-28309d1f3b76"),
// 		ModelPlanID: uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48"),
// 		Content:     "This is a test comment",
// 		Status:      models.DiscussionUnAnswered,
// 		CreatedBy:   "TEST",
// 		ModifiedBy:  "TEST",
// 	}
// }

// func makeDiscussionReply() models.DiscussionReply {
// 	return models.DiscussionReply{
// 		ID:           uuid.MustParse("9c5862b4-79ee-4ec0-a4b9-40c2566a5cf9"),
// 		DiscussionID: uuid.MustParse("89e137b8-59cb-4281-98d4-28309d1f3b76"),
// 		Content:      "This is a test comment",
// 		Resolution:   false,
// 		CreatedBy:    "TEST",
// 		ModifiedBy:   "TEST",
// 	}
// }

// func TestCreatePlanDiscussion(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	discussion := makeTestDiscussion()

// 	result, err := CreatePlanDiscussion(tc.Logger, &discussion, tc.Principal, tc.Store)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)
// }

// func TestUpdatePlanDiscussion(t *testing.T) {
// 	t.Skip() // TODO until we have no test inter-dependency
// 	tc := GetDefaultTestConfigs()
// 	discussion := makeTestDiscussion()
// 	discussion.Content = "This is now updated"

// 	result, err := UpdatePlanDiscussion(tc.Logger, &discussion, tc.Principal, tc.Store)

// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)

// 	assert.EqualValues(t, discussion.Content, result.Content)
// }

// func TestCreateDiscussionReply(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	reply := makeDiscussionReply()

// 	result, err := CreateDiscussionReply(tc.Logger, &reply, tc.Principal, tc.Store)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)

// }

// func TestUpdateDiscussionReply(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	reply := makeDiscussionReply()
// 	reply.Resolution = true

// 	result, err := UpdateDiscussionReply(tc.Logger, &reply, tc.Principal, tc.Store)
// 	assert.NoError(t, err)
// 	assert.EqualValues(t, reply.Resolution, result.Resolution)
// }

// func TestDiscussionReplyCollectionByDiscusionID(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	discussionID := uuid.MustParse("89e137b8-59cb-4281-98d4-28309d1f3b76")

// 	result, err := DiscussionReplyCollectionByDiscusionID(tc.Logger, discussionID, tc.Store)
// 	assert.NotNil(t, result)
// 	assert.NoError(t, err)

// }

// func TestPlanDiscussionCollectionByModelPlanID(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	modelPlanID := uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")

// 	result, err := PlanDiscussionCollectionByModelPlanID(tc.Logger, modelPlanID, tc.Store)
// 	assert.NotNil(t, result)
// 	assert.NoError(t, err)
// }

// func TestDeleteDiscussionReply(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	reply := makeDiscussionReply()
// 	reply.Resolution = true

// 	result, err := DeleteDiscussionReply(tc.Logger, &reply, tc.Principal, tc.Store)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)
// }

// func TestDeletePlanDiscussion(t *testing.T) {
// 	tc := GetDefaultTestConfigs()
// 	discussion := makeTestDiscussion()
// 	discussion.Content = "This is now updated"

// 	result, err := DeletePlanDiscussion(tc.Logger, &discussion, tc.Principal, tc.Store)

// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)
// }
