package worker

import (
	"context"
	"time"

	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *WorkerSuite) TestAnalyzedAuditJob() {
	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}
	// Create plan
	plan := suite.createModelPlan("Test Plan")

	// Update Plan
	changes := map[string]interface{}{
		"modelName": "New Name",
		"status":    models.ModelStatusOmbAsrfClearance,
		"archived":  true,
	}
	newPlan, err := resolvers.ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	// Add Documents
	suite.createPlanDocument(plan)

	// Add CrTdls
	suite.createPlanCrTdl(plan, "123-456", time.Now().UTC(), "Title", "Note")

	// Add collaborator. Only model leads should be added
	modelLead := suite.createPlanCollaborator(plan, "MINT", "New Model Lead", "MODEL_LEAD", "test@email.com")
	collaborator := suite.createPlanCollaborator(plan, "COLB", "New Colaborator", "MODEL_TEAM", "test@email.com")

	// Add Discussion
	suite.createPlanDiscussion(plan, "Test Comment")

	// Add sections
	// plan_basic
	basics, _ := resolvers.PlanBasicsGetByModelPlanID(worker.Logger, plan.ID, worker.Store)
	// plan_general_characteristic
	genChar, _ := resolvers.FetchPlanGeneralCharacteristicsByModelPlanID(worker.Logger, plan.ID, worker.Store)
	// plan_participants_and_provider
	participant, _ := resolvers.PlanParticipantsAndProvidersGetByModelPlanID(worker.Logger, plan.ID, worker.Store)
	// plan_beneficiaries
	beneficiary, _ := resolvers.PlanBeneficiariesGetByModelPlanID(worker.Logger, plan.ID, worker.Store)
	// plan_ops_eval_and_learning
	ops, _ := resolvers.PlanOpsEvalAndLearningGetByModelPlanID(worker.Logger, plan.ID, worker.Store)
	// plan_payments
	payment, _ := resolvers.PlanPaymentsReadByModelPlan(worker.Logger, worker.Store, plan.ID)

	// Update sections for ReadyForClearance
	clearanceChanges := map[string]interface{}{
		"status": "READY_FOR_CLEARANCE",
	}
	_, basicsErr := resolvers.UpdatePlanBasics(worker.Logger, basics.ID, clearanceChanges, suite.testConfigs.Principal, worker.Store)
	suite.NoError(basicsErr)
	_, charErr := resolvers.UpdatePlanGeneralCharacteristics(worker.Logger, genChar.ID, clearanceChanges, suite.testConfigs.Principal, worker.Store)
	suite.NoError(charErr)
	_, partErr := resolvers.PlanParticipantsAndProvidersUpdate(worker.Logger, participant.ID, clearanceChanges, suite.testConfigs.Principal, worker.Store)
	suite.NoError(partErr)

	// Update sections for ReadyForReview
	reviewChanges := map[string]interface{}{
		"status": "READY_FOR_REVIEW",
	}
	_, benErr := resolvers.PlanBeneficiariesUpdate(worker.Logger, beneficiary.ID, reviewChanges, suite.testConfigs.Principal, worker.Store)
	suite.NoError(benErr)
	_, opsErr := resolvers.PlanOpsEvalAndLearningUpdate(worker.Logger, ops.ID, reviewChanges, suite.testConfigs.Principal, worker.Store)
	suite.NoError(opsErr)
	_, paymentErr := resolvers.PlanPaymentsUpdate(worker.Logger, worker.Store, payment.ID, reviewChanges, suite.testConfigs.Principal)
	suite.NoError(paymentErr)

	err = worker.AnalyzedAuditJob(context.Background(), time.Now().UTC().Format("2006-01-02"), plan.ID.String())
	suite.NoError(err)

	// Get Stored audit
	analyzedAudit, err := worker.Store.AnalyzedAuditGetByModelPlanIDAndDate(worker.Logger, plan.ID, time.Now().UTC())
	suite.NoError(err)

	suite.NotNil(analyzedAudit)

	suite.EqualValues(newPlan.ModelName, analyzedAudit.ModelName)

	// ModelPlan Changes
	suite.EqualValues(plan.ModelName, analyzedAudit.Changes.ModelPlan.OldName)
	suite.EqualValues([]string{string(newPlan.Status)}, analyzedAudit.Changes.ModelPlan.StatusChanges)

	// Document Changes
	suite.EqualValues(analyzedAudit.Changes.Documents.Count, 1)

	// CrTdl Activity
	suite.True(analyzedAudit.Changes.CrTdls.Activity)

	// Plan Collaborators. Only model leads should be added.
	suite.True(lo.Contains(analyzedAudit.Changes.ModelLeads.Added, modelLead.FullName))
	suite.False((lo.Contains(analyzedAudit.Changes.ModelLeads.Added, collaborator.FullName)))

	// Discussions Activity
	suite.True(analyzedAudit.Changes.PlanDiscussions.Activity)

	// Section Changes
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.Updated, "plan_basics"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.Updated, "plan_general_characteristics"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.Updated, "plan_participants_and_providers"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.Updated, "plan_beneficiaries"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.Updated, "plan_ops_eval_and_learning"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.Updated, "plan_payments"))

	// ReadyForClearance Sections
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.ReadyForClearance, "plan_basics"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.ReadyForClearance, "plan_general_characteristics"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.ReadyForClearance, "plan_participants_and_providers"))

	// ReadyForReview Sections
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.ReadyForReview, "plan_beneficiaries"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.ReadyForReview, "plan_ops_eval_and_learning"))
	suite.True(lo.Contains(analyzedAudit.Changes.PlanSections.ReadyForReview, "plan_payments"))

	// Dont create if there are no changes
	mp := models.NewModelPlan("TEST", "NO CHANGES")

	noChangeMp, err := suite.testConfigs.Store.ModelPlanCreate(suite.testConfigs.Logger, mp)
	suite.NoError(err)
	suite.NotNil(noChangeMp)

	err = worker.AnalyzedAuditJob(context.Background(), time.Now().UTC().AddDate(0, 0, 1).Format("2006-01-02"), plan.ID.String())
	suite.NoError(err)

	_, err = worker.Store.AnalyzedAuditGetByModelPlanIDAndDate(worker.Logger, noChangeMp.ID, time.Now().UTC().AddDate(0, 0, 1))
	suite.Error(err)
}
