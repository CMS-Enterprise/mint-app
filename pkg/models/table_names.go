package models

// TableName represents the name of tables in the database
type TableName string

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
	TNMTOCategory                        TableName = "mto_category"
	TNMTOMilestone                       TableName = "mto_milestone"
	TNMTOSolution                        TableName = "mto_solution"
	TNMTOMilestoneSolutionLink           TableName = "mto_milestone_solution_link"
	TNMTOInfo                            TableName = "mto_info"
	TNMTOCommonMilestone                 TableName = "mto_common_milestone"
	TNMTOCommonSolutionContact           TableName = "mto_common_solution_contact"
	TNMTOCommonSolution                  TableName = "mto_common_solution"

	TNMTOSuggestedMilestone TableName = "mto_suggested_milestone"
)

// MTOTables is a list of all tables that are related to the MTO section
// This is used to filter the translated audit collection to only include MTO related tables
var MTOTables []TableName = []TableName{TNMTOCategory, TNMTOMilestone, TNMTOSolution, TNMTOMilestoneSolutionLink, TNMTOInfo}
