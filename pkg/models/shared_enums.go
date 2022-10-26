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

// These constants represent the different values of CMSCenter
const (
	SelectionAnnually   FrequencyType = "ANNUALLY"
	SelectionBiannually FrequencyType = "BIANNUALLY"
	SelectionQuarterly  FrequencyType = "QUARTERLY"
	SelectionMonthly    FrequencyType = "MONTHLY"
	SelectionRolling    FrequencyType = "ROLLING"
	SelectionOther      FrequencyType = "OTHER"
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
	TLSModelBasics                     TaskListSection = "MODEL_BASICS"
	TLSGeneralCharacteristics          TaskListSection = "GENERAL_CHARACTERISTICS"
	TLSParticipantsAndProviders        TaskListSection = "PARTICIPANTS_AND_PROVIDERS"
	TLSBeneficiaries                   TaskListSection = "BENEFICIARIES"
	TLSOperationsEvaluationAndLearning TaskListSection = "OPERATIONS_EVALUATION_AND_LEARNING"
	TLSPayment                         TaskListSection = "PAYMENT"
	TLSItTools                         TaskListSection = "IT_TOOLS"
	TLSPrepareForClearance             TaskListSection = "PREPARE_FOR_CLEARANCE"
)
