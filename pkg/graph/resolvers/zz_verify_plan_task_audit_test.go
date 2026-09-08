package resolvers

import (
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestZZVerifyPlanTaskChangeHistory is a throwaway verification test for wiring up
// audit tracking + translation for the plan_task table. Not meant to be committed.
func (suite *ResolverSuite) TestZZVerifyPlanTaskChangeHistory() {
	plan := suite.createModelPlan("Verify Plan Task Change History")

	_, err := PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyTwoPager,
		true,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	suite.dangerousQueueAndTranslateAllAudits()

	audits, err := TranslatedAuditCollectionGetByModelPlanID(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		plan.ID,
		nil,
		nil,
	)
	suite.NoError(err)

	var planTaskAudits []*models.TranslatedAudit
	for _, a := range audits {
		if a.TableName == models.TNPlanTask {
			planTaskAudits = append(planTaskAudits, a)
		}
	}
	suite.NotEmpty(planTaskAudits, "expected at least one translated audit for plan_task")

	for _, a := range planTaskAudits {
		fields, err := TranslatedAuditFieldCollectionGetByTranslatedAuditID(suite.testConfigs.Context, a.ID)
		suite.NoError(err)
		for _, f := range fields {
			fmt.Printf(
				"plan_task audit: action=%s field=%s label=%s old=%v->%v oldTranslated=%v->%v\n",
				a.Action, f.FieldName, f.FieldNameTranslated, f.Old, f.New, f.OldTranslated, f.NewTranslated,
			)
		}
	}
}
