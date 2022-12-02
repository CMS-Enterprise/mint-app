package worker

import (
	"context"
	"time"

	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
)

func (suite *WorkerSuite) TestNewAnalyzedAuditJob() {
	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}
	// Create plan
	plan := suite.createModelPlan("Test Plan2")

	// Add Documents
	suite.createPlanDocument(plan)

	// Add CrTdls
	suite.createPlanCrTdl(plan, "123-456", time.Now(), "Title", "Note")

	// Add collaborator
	collaborator := suite.createPlanCollaborator(plan, "MINT", "New Colaborator", "MODEL_LEAD", "test@email.com")

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

	err := worker.AnalyzedAuditJob(context.Background(), plan.ID, time.Now())
	suite.NoError(err)

	// Get Stored audit
	analyzedAudit, err := worker.Store.AnalyzedAuditGetByModelPlanIDAndDate(worker.Logger, plan.ID, time.Now())
	suite.NoError(err)

	suite.NotNil(analyzedAudit)

	// ModelPlan Changes
	suite.EqualValues(plan.ModelName, analyzedAudit.Changes.ModelPlan.NameChange.New)
	suite.EqualValues([]string{string(plan.Status)}, analyzedAudit.Changes.ModelPlan.StatusChanges)

	// Document Changes
	suite.EqualValues(analyzedAudit.Changes.Documents.Count, 1)

	// CrTdl Activity
	suite.True(analyzedAudit.Changes.CrTdls.Activity)

	// Plan Collaborators
	suite.True(lo.Contains(analyzedAudit.Changes.PlanCollaborators.Added, collaborator.FullName))

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

}
