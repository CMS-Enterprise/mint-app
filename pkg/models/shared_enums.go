package models

// TriStateAnswer is an enum that represents a yes/no/tbd answer
type TriStateAnswer string

// These constants represent the different values of TriStateAnswer
const (
	TriYes TriStateAnswer = "YES"
	TriNo  TriStateAnswer = "NO"
	TriTBD TriStateAnswer = "TBD"
)

// TaskStatus is an enum that represents the status of a task
type TaskStatus string

// These constants represent the different values of TaskStatus
const (
	TaskReady             TaskStatus = "READY"
	TaskInProgress        TaskStatus = "IN_PROGRESS"
	TaskReadyForReview    TaskStatus = "READY_FOR_REVIEW"
	TaskReadyForClearance TaskStatus = "READY_FOR_CLEARANCE"
)

// FrequencyType represents the possible Frequency options
type FrequencyType string

// These constants represent the different values of FrequencyType
const (
	FrequencyTypeAnnually     FrequencyType = "ANNUALLY"
	FrequencyTypeSemiannually FrequencyType = "SEMIANNUALLY"
	FrequencyTypeQuarterly    FrequencyType = "QUARTERLY"
	FrequencyTypeMonthly      FrequencyType = "MONTHLY"
	FrequencyTypeContinually  FrequencyType = "CONTINUALLY"
	FrequencyTypeOther        FrequencyType = "OTHER"
)

// ConfidenceType representes the values possible for the amount of confidence in an answer
type ConfidenceType string

// These represent Confidence Type Answers
const (
	ConfidenceNotAtAll   ConfidenceType = "NOT_AT_ALL"
	ConfidenceSlightly   ConfidenceType = "SLIGHTLY"
	ConfidenceFairly     ConfidenceType = "FAIRLY"
	ConfidenceCompletely ConfidenceType = "COMPLETELY"
)

// OverlapType represents the possible Overlap Type answers
type OverlapType string

// These constants represent the possible OverLap Type values
const (
	OverlapYesNeedPolicies OverlapType = "YES_NEED_POLICIES"
	OverlapYesNoIssues     OverlapType = "YES_NO_ISSUES"
	OverlapNo              OverlapType = "NO"
)

// TaskListSection represents the parts of the task list
type TaskListSection string

// These are the options for TaskListSection
const (
	TLSBasics                          TaskListSection = "BASICS"
	TLSGeneralCharacteristics          TaskListSection = "GENERAL_CHARACTERISTICS"
	TLSParticipantsAndProviders        TaskListSection = "PARTICIPANTS_AND_PROVIDERS"
	TLSBeneficiaries                   TaskListSection = "BENEFICIARIES"
	TLSOperationsEvaluationAndLearning TaskListSection = "OPERATIONS_EVALUATION_AND_LEARNING"
	TLSPayment                         TaskListSection = "PAYMENT"
	TLSItTools                         TaskListSection = "IT_TOOLS"
	TLSPrepareForClearance             TaskListSection = "PREPARE_FOR_CLEARANCE"
)

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
)
