package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/iancoleman/strcase"

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
		return GQLTableName("analyzedAudit")
	case "discussion_reply":
		return GQLTableName("discussionReply")
	case "existing_model":
		return GQLTableName("existingModel")
	case "existing_model_link":
		return GQLTableName("existingModelLink")
	case "model_plan":
		return GQLTableName("modelPlan")
	case "nda_agreement":
		return GQLTableName("ndaAgreement")
	case "operational_need":
		return GQLTableName("operationalNeed")
	case "operational_solution":
		return GQLTableName("operationalSolution")
	case "operational_solution_subtask":
		return GQLTableName("operationalSolutionSubtask")
	case "plan_basics":
		return GQLTableName("planBasics")
	case "plan_beneficiaries":
		return GQLTableName("planBeneficiaries")
	case "plan_collaborator":
		return GQLTableName("planCollaborator")
	case "plan_cr_tdl":
		return GQLTableName("planCrTdl")
	case "plan_discussion":
		return GQLTableName("planDiscussion")
	case "plan_document":
		return GQLTableName("planDocument")
	case "plan_document_solution_link":
		return GQLTableName("planDocumentSolutionLink")
	case "plan_general_characteristics":
		return GQLTableName("planGeneralCharacteristics")
	case "plan_ops_eval_and_learning":
		return GQLTableName("planOpsEvalAndLearning")
	case "plan_participants_and_providers":
		return GQLTableName("planParticipantsAndProviders")
	case "plan_payments":
		return GQLTableName("planPayments")
	case "possible_operational_need":
		return GQLTableName("possibleOperationalNeed")
	case "possible_operational_solution":
		return GQLTableName("possibleOperationalSolution")
	case "user_account":
		return GQLTableName("userAccount")

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

// NameCamelCase converts the name database string value, to lower case camel. This is meant as an approximation of the GQL field name
func (field *Field) NameCamelCase() string { //can include ctx context.Context if desired

	return toLowerCamelCase(field.Name)

}

func toLowerCamelCase(s string) string {
	return strcase.ToLowerCamel(s)
}
