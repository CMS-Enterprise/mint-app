package models

// TeamRole represents the role of a team member
type TeamRole string

// These constants represent the different values of TeamRole
const (
	TeamRoleModelLead  TeamRole = "MODEL_LEAD"
	TeamRoleModelTeam  TeamRole = "MODEL_TEAM"
	TeamRoleLeadership TeamRole = "LEADERSHIP"
	TeamRoleLearning   TeamRole = "LEARNING"
	TeamRoleEvaluation TeamRole = "EVALUATION"
)

// ModelType is an enum that represents the basic type of a model
type ModelType string

// These constants represent the different values of ModelType
const (
	MTVoluntary ModelType = "VOLUNTARY"
	MTMandatory ModelType = "MANDATORY"
	MTTBD       ModelType = "TBD"
)

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
	TaskReady      TaskStatus = "READY"
	TaskInProgress TaskStatus = "IN_PROGRESS"
	TaskComplete   TaskStatus = "COMPLETE"
)

//DiscussionStatus is an enum that represents the status of a Discussion
type DiscussionStatus string

//These constants represent the possible values of a DiscussionStatus
const (
	DiscussionAnswered   DiscussionStatus = "ANSWERED"
	DiscussionWaiting    DiscussionStatus = "WAITING_FOR_RESPONSE"
	DiscussionUnAnswered DiscussionStatus = "UNANSWERED"
)

//TaskSection Represents the possible task sections in the model plan worklist
type TaskSection string

//These constants represent the possible values of a TaskSection enum
const (
	TsBasics          TaskSection = "BASICS"
	TsCharacteristics TaskSection = "CHARACTERISTICS"
	TsParticipants    TaskSection = "PARTICIPANTS"
	TsBeneficiaries   TaskSection = "BENEFICIARIES"
	TsOperations      TaskSection = "OPERATIONS"
	TsPayment         TaskSection = "PAYMENT"
	TsFinal           TaskSection = "FINAL"
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

//ConfidenceType representes the values possible for the amount of confidence in an answer
type ConfidenceType string

//These represent Confidence Type Answers
const (
	ConfidenceNotAtAll   ConfidenceType = "NOT_AT_ALL"
	ConfidenceSlightly   ConfidenceType = "SLIGHTLY"
	ConfidenceFairly     ConfidenceType = "FAIRLY"
	ConfidenceCompletely ConfidenceType = "COMPLETELY"
)

//OverlapType represents the possible Overlap Type answers
type OverlapType string

//These constants represent the possible OverLap Type values
const (
	OverlapYesNeedPolicies OverlapType = "YES_NEED_POLICIES"
	OverlapYesNoIssues     OverlapType = "YES_NO_ISSUES"
	OverlapNo              OverlapType = "NO"
)
