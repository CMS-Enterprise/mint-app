package models

type TranslationProcessingStatusType string

const (
	TPSQueued       TranslationProcessingStatusType = "QUEUED"
	TPSNotProcessed TranslationProcessingStatusType = "NOT_PROCESSED"
	TPSProcessed    TranslationProcessingStatusType = "PROCESSED"
	TPSFailed       TranslationProcessingStatusType = "FAILED"
)

// TranslatedAuditQueue is a structure that shows if an audit has, or will be processed
type TranslatedAuditQueue struct {
	baseStruct
	ChangeID int                             `json:"changeID" db:"change_id"`
	Status   TranslationProcessingStatusType `json:"status" db:"status"`
	Note     TranslationProcessingStatusType `json:"note" db:"note"`
}
