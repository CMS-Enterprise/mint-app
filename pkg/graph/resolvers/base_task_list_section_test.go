package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PreUpdateSuite is the testify suite for the resolver package
type PreUpdateSuite struct {
	suite.Suite
	Principal *authentication.ApplicationPrincipal
}

// TestPreUpdateSuite runs the resolver test suite
func TestPreUpdateSuite(t *testing.T) {
	css := new(PreUpdateSuite)
	username := "FAKE"
	css.Principal = &authentication.ApplicationPrincipal{
		Username:          username,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
		UserAccount: &authentication.UserAccount{
			ID:         uuid.MustParse("00000001-0001-0001-0001-000000000007"), // Not actually interacting with DB, can mock the account
			Username:   &username,
			CommonName: "Fake Name",
			FamilyName: "Name",
			GivenName:  "Fake",
		},
	}
	suite.Run(t, css)
}

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func (suite *PreUpdateSuite) TestBaseTaskListSectionPreUpdate() {

	taskList := models.NewBaseTaskListSection(uuid.UUID{}, uuid.UUID{})

	planBasics := models.NewPlanBasics(taskList)

	changes := map[string]interface{}{
		"modelType": []models.ModelType{models.MTVoluntary},
		"goal":      "Some goal",
	}

	err := BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	//0/5 in Progess
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskInProgress)
	suite.Nil(planBasics.ReadyForReviewDts)
	suite.Nil(planBasics.ReadyForReviewBy)

	rev := uuid.MustParse("00000001-0001-0001-0001-000000000009")
	//1/5 Ready for Review
	changes["status"] = models.TaskReadyForReview

	suite.Principal.UserAccount.ID = rev
	err = BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskReadyForReview)
	suite.Equal(*planBasics.ReadyForReviewBy, rev)
	suite.NotNil(planBasics.ReadyForReviewDts)

	//2/5 Ready for Clearance
	changes["status"] = models.TaskReadyForClearance
	err = BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskReadyForClearance)
	suite.Equal(*planBasics.ReadyForReviewBy, rev)
	suite.NotNil(planBasics.ReadyForClearanceDts)

	//3/5 When changed from READY_FOR_CLEARANCE it will always be moved to IN_PROGRESS
	changes["status"] = models.TaskReadyForReview
	err = BaseTaskListSectionPreUpdate(&zap.Logger{}, planBasics, changes, suite.Principal, &storage.Store{})
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskInProgress)

}
