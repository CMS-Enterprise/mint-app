package worker

import (
	"time"

	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
)

func (suite *WorkerSuite) TestNewAnalyzedAuditJob() {
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
	basics, _ := resolvers.PlanBasicsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	// plan_general_characteristic
	genChar, _ := resolvers.FetchPlanGeneralCharacteristicsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	// plan_participants_and_provider
	participant, _ := resolvers.PlanParticipantsAndProvidersGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	// plan_beneficiaries
	beneficiary, _ := resolvers.PlanBeneficiariesGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	// plan_ops_eval_and_learning
	ops, _ := resolvers.PlanOpsEvalAndLearningGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	// plan_payments
	payment, _ := resolvers.PlanPaymentsReadByModelPlan(suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)

	// Update sections for ReadyForClearance
	clearanceChanges := map[string]interface{}{
		"status": "READY_FOR_CLEARANCE",
	}
	_, basicsErr := resolvers.UpdatePlanBasics(suite.testConfigs.Logger, basics.ID, clearanceChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(basicsErr)
	_, charErr := resolvers.UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, genChar.ID, clearanceChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(charErr)
	_, partErr := resolvers.PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, participant.ID, clearanceChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(partErr)
	// Update sections for ReadyForReview
	reviewChanges := map[string]interface{}{
		"status": "READY_FOR_REVIEW",
	}

	_, benErr := resolvers.PlanBeneficiariesUpdate(suite.testConfigs.Logger, beneficiary.ID, reviewChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(benErr)
	_, opsErr := resolvers.PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, ops.ID, reviewChanges, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(opsErr)
	_, paymentErr := resolvers.PlanPaymentsUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, payment.ID, reviewChanges, suite.testConfigs.Principal)
	suite.NoError(paymentErr)

	analyzedAudit, err := AnalyzedAuditJob(plan.ID, time.Now(), suite.testConfigs.Store, suite.testConfigs.Logger)
	suite.NoError(err)
	suite.NotNil(&analyzedAudit)
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
