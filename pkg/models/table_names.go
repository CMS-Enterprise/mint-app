package models

import (
	"github.com/cms-enterprise/mint-app/pkg/helpers"
)

// TableName represents the name of tables in the database
type TableName string

type TableNames []TableName

// String implements the stringer interface for TableNames
//
//	It will sort the TableNames and return a comma separated string
func (t TableNames) String() string {
	return helpers.JoinStringSlice(t, true)
}

// These are the options for TableNameEnum
const (
	TNActivity                           TableName = "activity"
	TNAnalyzedAudit                      TableName = "analyzed_audit"
	TNDiscussionReply                    TableName = "discussion_reply"
	TNExistingModel                      TableName = "existing_model"
	TNExistingModelLink                  TableName = "existing_model_link"
	TNModelPlan                          TableName = "model_plan"
	TNNdaAgreement                       TableName = "nda_agreement"
	TNOperationalNeed                    TableName = "operational_need"
	TNOperationalSolution                TableName = "operational_solution"
	TNOperationalSolutionSubtask         TableName = "operational_solution_subtask"
	TNPlanBasics                         TableName = "plan_basics"
	TNPlanBeneficiaries                  TableName = "plan_beneficiaries"
	TNPlanCollaborator                   TableName = "plan_collaborator"
	TNPlanCr                             TableName = "plan_cr"
	TNPlanDiscussion                     TableName = "plan_discussion"
	TNPlanDocument                       TableName = "plan_document"
	TNPlanDocumentSolutionLink           TableName = "plan_document_solution_link"
	TNPlanFavorite                       TableName = "plan_favorite"
	TNPlanGeneralCharacteristics         TableName = "plan_general_characteristics"
	TNPlanOpsEvalAndLearning             TableName = "plan_ops_eval_and_learning"
	TNPlanParticipantsAndProviders       TableName = "plan_participants_and_providers"
	TNPlanPayments                       TableName = "plan_payments"
	TNPlanTdl                            TableName = "plan_tdl"
	TNPossibleNeedSolutionLink           TableName = "possible_need_solution_link"
	TNPossibleOperationalNeed            TableName = "possible_operational_need"
	TNPossibleOperationalSolution        TableName = "possible_operational_solution"
	TNPossibleOperationalSolutionContact TableName = "possible_operational_solution_contact"
	TNTag                                TableName = "tag"
	TNTranslatedAudit                    TableName = "translated_audit"
	TNTranslatedAuditField               TableName = "translated_audit_field"
	TNTranslatedAuditQueue               TableName = "translated_audit_queue"
	TNUserAccount                        TableName = "user_account"
	TNUserNotification                   TableName = "user_notification"
	TNUserNotificationPreferences        TableName = "user_notification_preferences"
	TNUserViewCustomization              TableName = "user_view_customization"
	TNPlanDataExchangeApproach           TableName = "plan_data_exchange_approach"
	TNIddocQuestionnaire                 TableName = "iddoc_questionnaire"
	TNMTOCategory                        TableName = "mto_category"
	TNMTOMilestone                       TableName = "mto_milestone"
	TNMTOSolution                        TableName = "mto_solution"
	TNMTOMilestoneSolutionLink           TableName = "mto_milestone_solution_link"
	TNMTOInfo                            TableName = "mto_info"
	TNMTOCommonMilestone                 TableName = "mto_common_milestone"
	TNMTOCommonSolutionContact           TableName = "mto_common_solution_contact"
	TNMTOCommonSolution                  TableName = "mto_common_solution"
	TNMTOCommonSolutionContractor        TableName = "mto_common_solution_contractor"
	TNMTOCommonSolutionSystemOwner       TableName = "mto_common_solution_system_owner"
	TNPlanTimeline                       TableName = "plan_timeline"
	TNMTOSuggestedMilestone              TableName = "mto_suggested_milestone"
	TNMTOTemplate                        TableName = "mto_template"
	TNMTOTemplateCategory                TableName = "mto_template_category"
	TNMTOTemplateMilestone               TableName = "mto_template_milestone"
	TNMTOTemplateMilestoneSolutionLink   TableName = "mto_template_milestone_solution_link"
	TNMTOTemplateSolution                TableName = "mto_template_solution"
	TNModelPlanMTOTemplateLink           TableName = "model_plan_mto_template_link"
	TNMTOMilestoneNote                   TableName = "mto_milestone_note"
	TNKeyContact                         TableName = "key_contact"
	TNKeyContactCategory                 TableName = "key_contact_category"
)

// MTOTables is a list of all tables that are related to the MTO section
// This is used to filter the translated audit collection to only include MTO related tables
var MTOTables []TableName = []TableName{TNMTOCategory, TNMTOMilestone, TNMTOSolution, TNMTOMilestoneSolutionLink, TNMTOInfo, TNMTOMilestoneNote, TNMTOTemplate}
