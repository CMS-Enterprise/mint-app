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
)
