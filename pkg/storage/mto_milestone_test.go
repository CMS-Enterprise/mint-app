package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (s *StoreTestSuite) TestMTOMilestoneCreateAllowConflicts() {
	actorUserID := s.principal.Account().ID

	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	commonMilestone, err := createMTOCommonMilestone(
		tx,
		fmt.Sprintf("Allow conflicts test %s", uuid.New().String()),
		"Used to verify milestone allow conflicts behavior.",
		"Operations",
		nil,
		[]models.MTOFacilitator{models.MTOFacilitatorModelTeam},
		nil,
		actorUserID,
	)
	s.Require().NoError(err)

	modelPlan := models.NewModelPlan(actorUserID, "Allow conflicts milestone test")
	createdModelPlan, err := s.store.ModelPlanCreate(tx, s.logger, modelPlan)
	s.Require().NoError(err)

	// first insert — should succeed and report newly inserted
	ms1 := models.NewMTOMilestone(actorUserID, nil, nil, &commonMilestone.ID, createdModelPlan.ID, nil)
	result1, err := MTOMilestoneCreateAllowConflicts(tx, s.logger, ms1)
	s.Require().NoError(err)
	s.Require().NotNil(result1)
	s.True(result1.NewlyInserted)
	s.NotEqual(uuid.Nil, result1.ID)

	// second insert with same model_plan_id + mto_common_milestone_id — must not error and must return the existing row
	ms2 := models.NewMTOMilestone(actorUserID, nil, nil, &commonMilestone.ID, createdModelPlan.ID, nil)
	result2, err := MTOMilestoneCreateAllowConflicts(tx, s.logger, ms2)
	s.Require().NoError(err)
	s.Require().NotNil(result2)
	s.False(result2.NewlyInserted)
	s.Equal(result1.ID, result2.ID)
}
