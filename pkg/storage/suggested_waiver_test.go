package storage

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (s *StoreTestSuite) TestSuggestedWaiverInsertForModelPlan() {
	actorID := s.principal.Account().ID

	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	err = setCurrentSessionUserVariable(tx, actorID)
	s.Require().NoError(err)

	modelPlan := models.NewModelPlan(actorID, "Suggested waiver insert test")
	createdPlan, err := s.store.ModelPlanCreate(tx, s.logger, modelPlan)
	s.Require().NoError(err)

	// Insert should succeed and return at least one suggested waiver
	results, err := SuggestedWaiverInsertForModelPlan(tx, s.logger, createdPlan.ID, actorID)
	s.Require().NoError(err)
	s.NotEmpty(results, "expected at least one suggested waiver to be inserted")

	// Second call should be a no-op (ON CONFLICT DO NOTHING) and return empty
	results2, err := SuggestedWaiverInsertForModelPlan(tx, s.logger, createdPlan.ID, actorID)
	s.Require().NoError(err)
	s.Empty(results2, "second insert should return no rows (all conflicts)")
}
