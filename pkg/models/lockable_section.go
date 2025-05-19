package models

// LockableSection represents any section of the application that a user can uniquely hold a lock on.
// It _largely_ (currently) maps to the sections of the Task List, but also includes Data Exchange, which notably isn't part of the Task List.
type LockableSection string

// These are the options for LockableSection
const (
	LockableSectionBasics                          LockableSection = "BASICS"
	LockableSectionGeneralCharacteristics          LockableSection = "GENERAL_CHARACTERISTICS"
	LockableSectionParticipantsAndProviders        LockableSection = "PARTICIPANTS_AND_PROVIDERS"
	LockableSectionBeneficiaries                   LockableSection = "BENEFICIARIES"
	LockableSectionOperationsEvaluationAndLearning LockableSection = "OPERATIONS_EVALUATION_AND_LEARNING"
	LockableSectionPayment                         LockableSection = "PAYMENT"
	LockableSectionItTools                         LockableSection = "IT_TOOLS"
	LockableSectionPrepareForClearance             LockableSection = "PREPARE_FOR_CLEARANCE"
	LockableSectionDataExchangeApproach            LockableSection = "DATA_EXCHANGE_APPROACH"
	LockableSectionDataModelsToOperationMatrix     LockableSection = "MODELS_TO_OPERATION_MATRIX"
)
