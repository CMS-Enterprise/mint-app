package constants

import (
	"strings"

	"github.com/google/uuid"
)

const sampleModelUUIDString = "f25d8f70-6470-47e6-a6d9-debc10f26567"
const systemAccountUUIDString = "00000001-0001-0001-0001-000000000001"

// SampleModelName is the name of the sample model
const SampleModelName = "Enhancing Oncology Model"

// Future Enhancement: Utilize the shared translation package instead of trying to translate these constants
// Constants for database table names
const (
	PlanCollaborator             = "plan_collaborator"
	PlanBeneficiaries            = "plan_beneficiaries"
	PlanDiscussion               = "plan_discussion"
	DiscussionReply              = "discussion_reply"
	PlanDocument                 = "plan_document"
	PlanGeneralCharacteristics   = "plan_general_characteristics"
	PlanOpsEvalAndLearning       = "plan_ops_eval_and_learning"
	PlanParticipantsAndProviders = "plan_participants_and_providers"
	PlanPayments                 = "plan_payments"
	OperationalNeed              = "operational_need"
	OperationalSolution          = "operational_solution"
	PlanBasics                   = "plan_basics"
	OperationalSolutionSubtask   = "operational_solution_subtask"
	ModelPlan                    = "model_plan"
	PlanCr                       = "plan_cr"
	PlanTdl                      = "plan_tdl"
)

// Constants for humanized table names
var humanizedTableNames = map[string]string{
	PlanCollaborator:             "Collaborator",
	PlanBeneficiaries:            "Beneficiaries",
	PlanDiscussion:               "Discussion",
	DiscussionReply:              "Discussion Reply",
	PlanDocument:                 "Document",
	PlanGeneralCharacteristics:   "General Characteristics",
	PlanOpsEvalAndLearning:       "Operations, Evaluation, and Learning",
	PlanParticipantsAndProviders: "Participants and Providers",
	PlanPayments:                 "Payments",
	OperationalNeed:              "Operational Need",
	OperationalSolution:          "Operational Solution",
	PlanBasics:                   "Model Basics",
	OperationalSolutionSubtask:   "Operational Solution Subtask",
	ModelPlan:                    "Model",
	PlanCr:                       "CR",
	PlanTdl:                      "TDL",
}

// GetHumanizedTableName returns the humanized name for the given table name
func GetHumanizedTableName(tableName string) (string, bool) {
	humanizedName, wasFound := humanizedTableNames[strings.ToLower(tableName)]
	return humanizedName, wasFound
}

// GetSampleUUID returns a UUID my model plan ID
func GetSampleUUID() uuid.UUID {
	return uuid.MustParse(sampleModelUUIDString)
}

// GetSystemAccountUUID returns the user account of the Mint System User Account
func GetSystemAccountUUID() uuid.UUID {
	return uuid.MustParse(systemAccountUUIDString)
}
