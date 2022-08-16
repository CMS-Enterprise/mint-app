package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"

	"github.com/cmsgov/mint-app/pkg/models"
)

// PreUpdateSuite is the testify suite for the resolver package
type PreUpdateSuite struct {
	suite.Suite
}

// TestPreUpdateSuite runs the resolver test suite
func TestPreUpdateSuite(t *testing.T) {
	css := new(PreUpdateSuite)
	suite.Run(t, css)
}

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func (suite *PreUpdateSuite) TestBaseTaskListSectionPreUpdate() {
	taskList := models.NewBaseTaskListSection(uuid.UUID{}, "FAKE")
	planBasics := models.PlanBasics{
		BaseTaskListSection: taskList,
	}
	changes := map[string]interface{}{
		"modelType": models.MTVoluntary,
		"goal":      "Some goal",
	}
	err := BaseTaskListSectionPreUpdate(&planBasics, changes, "FAKE")
	//0/5 in Progess
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskInProgress)
	suite.Nil(planBasics.ReadyForReviewDts)
	suite.Nil(planBasics.ReadyForReviewBy)

	//1/5 Ready for Review
	changes["status"] = models.TaskReadyForReview
	err = BaseTaskListSectionPreUpdate(&planBasics, changes, "REVI")
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskReadyForReview)
	suite.EqualValues(*planBasics.ReadyForReviewBy, "REVZ")
	suite.NotNil(planBasics.ReadyForReviewDts)

}
