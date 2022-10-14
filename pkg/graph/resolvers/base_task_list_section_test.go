package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// PreUpdateSuite is the testify suite for the resolver package
type PreUpdateSuite struct {
	suite.Suite
	Principal *authentication.EUAPrincipal
}

// TestPreUpdateSuite runs the resolver test suite
func TestPreUpdateSuite(t *testing.T) {
	css := new(PreUpdateSuite)
	css.Principal = &authentication.EUAPrincipal{
		EUAID:             "FAKE",
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}
	suite.Run(t, css)
}

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func (suite *PreUpdateSuite) TestBaseTaskListSectionPreUpdate() {
	taskList := models.NewBaseTaskListSection("FAKE", uuid.UUID{})

	planBasics := models.NewPlanBasics(taskList)

	changes := map[string]interface{}{
		"modelType": models.MTVoluntary,
		"goal":      "Some goal",
	}

	err := BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	//0/5 in Progess
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskInProgress)
	suite.Nil(planBasics.ReadyForReviewDts)
	suite.Nil(planBasics.ReadyForReviewBy)

	//1/5 Ready for Review
	changes["status"] = models.TaskReadyForReview
	suite.Principal.EUAID = "REVI"
	err = BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskReadyForReview)
	suite.EqualValues(*planBasics.ReadyForReviewBy, "REVI")
	suite.NotNil(planBasics.ReadyForReviewDts)

	//2/5 Ready for Clearance
	changes["status"] = models.TaskReadyForClearance
	suite.Principal.EUAID = "REVI"
	err = BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskReadyForClearance)
	suite.EqualValues(*planBasics.ReadyForClearanceBy, "REVI")
	suite.NotNil(planBasics.ReadyForClearanceDts)

	//3/5 When changed from READY_FOR_CLEARANCE it will always be moved to IN_PROGRESS
	changes["status"] = models.TaskReadyForReview
	suite.Principal.EUAID = "REVI"
	err = BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskInProgress)

}
