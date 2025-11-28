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
	PlanDataExchangeApproach     = "plan_data_exchange_approach"
	PlanTimeline                 = "plan_timeline"
	TNMTOCategory                = "mto_category"
	TNMTOMilestone               = "mto_milestone"
	TNMTOSolution                = "mto_solution"
	TNMTOMilestoneSolutionLink   = "mto_milestone_solution_link"
	TNMTOInfo                    = "mto_info"
	TNMTOMilestoneNote           = "mto_milestone_note"
	ModelPlanMTOTemplateLink     = "model_plan_mto_template_link"
)

const (
	// MTOHumanizedName is the humanized name for the MTO section
	// since we don't care about the specific column name we will use a generic name
	MTOHumanizedName = "Model-to-operations matrix (MTO)"
)

// Constants for humanized table names
var humanizedTableNames = map[string]string{
	PlanCollaborator:             "Collaborator",
	PlanBeneficiaries:            "Beneficiaries",
	PlanDiscussion:               "Discussion",
	DiscussionReply:              "Discussion reply",
	PlanDocument:                 "Document",
	PlanGeneralCharacteristics:   "General characteristics",
	PlanOpsEvalAndLearning:       "Operations, evaluation, and learning",
	PlanParticipantsAndProviders: "Participants and providers",
	PlanPayments:                 "Payments",
	OperationalNeed:              "Operational need",
	OperationalSolution:          "Operational solution",
	PlanBasics:                   "Model basics",
	OperationalSolutionSubtask:   "Operational solution subtask",
	ModelPlan:                    "Model",
	PlanCr:                       "CR",
	PlanTdl:                      "TDL",
	PlanDataExchangeApproach:     "Data exchange approach",
	PlanTimeline:                 "Model timeline",
	// Since MTO is more a group of tables we just specify model-to-operations matrix (MTO) for humanized name
	TNMTOCategory:              MTOHumanizedName,
	TNMTOMilestone:             MTOHumanizedName,
	TNMTOSolution:              MTOHumanizedName,
	TNMTOMilestoneSolutionLink: MTOHumanizedName,
	TNMTOInfo:                  MTOHumanizedName,
	TNMTOMilestoneNote:         MTOHumanizedName,
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
