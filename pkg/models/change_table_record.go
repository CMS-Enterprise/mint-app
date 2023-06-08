package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// ChangeTableRecord represents an Elasticsearch record from the change table
type ChangeTableRecord struct {
	GUID        string                      `json:"guid"`
	ModelPlanID uuid.UUID                   `json:"model_plan_id"`
	TableID     int                         `json:"table_id"`
	TableName   string                      `json:"table_name"`
	PrimaryKey  uuid.UUID                   `json:"primary_key"`
	ForeignKey  *uuid.UUID                  `json:"foreign_key"`
	Action      string                      `json:"action"`
	Fields      ChangedFields               `json:"fields"`
	ModifiedDts *time.Time                  `json:"modified_dts"`
	ModifiedBy  *authentication.UserAccount `json:"modified_by"`
}

// GQLTableName casts a table name into a strict type for GQL
func (ctr *ChangeTableRecord) GQLTableName() GQLTableName { //can include ctx context.Context if desired

	switch ctr.TableName { // TODO: this could be a map if desired, but GO doesn't allow constant maps
	case "analyzed_audit":
		return GQLTableName("AnalyzedAudit")
	case "discussion_reply":
		return GQLTableName("DiscussionReply")
	case "existing_model":
		return GQLTableName("ExistingModel")
	case "existing_model_link":
		return GQLTableName("ExistingModelLink")
	case "model_plan":
		return GQLTableName("ModelPlan")
	case "nda_agreement":
		return GQLTableName("NdaAgreement")
	case "operational_need":
		return GQLTableName("OperationalNeed")
	case "operational_solution":
		return GQLTableName("OperationalSolution")
	case "operational_solution_subtask":
		return GQLTableName("OperationalSolutionSubtask")
	case "plan_basics":
		return GQLTableName("PlanBasics")
	case "plan_beneficiaries":
		return GQLTableName("PlanBeneficiaries")
	case "plan_collaborator":
		return GQLTableName("PlanCollaborator")
	case "plan_cr_tdl":
		return GQLTableName("PlanCrTdl")
	case "plan_discussion":
		return GQLTableName("PlanDiscussion")
	case "plan_document":
		return GQLTableName("PlanDocument")
	case "plan_document_solution_link":
		return GQLTableName("PlanDocumentSolutionLink")
	case "plan_general_characteristics":
		return GQLTableName("PlanGeneralCharacteristics")
	case "plan_ops_eval_and_learning":
		return GQLTableName("PlanOpsEvalAndLearning")
	case "plan_participants_and_providers":
		return GQLTableName("PlanParticipantsAndProviders")
	case "plan_payments":
		return GQLTableName("PlanPayments")
	case "possible_operational_need":
		return GQLTableName("PossibleOperationalNeed")
	case "possible_operational_solution":
		return GQLTableName("PossibleOperationalSolution")
	case "user_account":
		return GQLTableName("UserAccount")

	default:
		return GQLTableName("UNKNOWN") //TODO: this will fail
	}

}

// ChangedFields contains a slice of changed fields.
type ChangedFields struct {
	Changes []*Field `json:"changes"`
}

// Field represents an individual field, including its name and associated value.
type Field struct {
	Name  string     `json:"name"`
	Value FieldValue `json:"value"`
}

// FieldValue represents the new and old values of a changed field.
type FieldValue struct {
	New interface{} `json:"new"`
	Old interface{} `json:"old"`
}
