package models

import "github.com/google/uuid"

type TranslatedAuditQueueStatusType string

// All the possible status of the
const (
	TPSQueued       TranslatedAuditQueueStatusType = "QUEUED"
	TPSNotProcessed TranslatedAuditQueueStatusType = "NOT_PROCESSED"
	TPSProcessed    TranslatedAuditQueueStatusType = "PROCESSED"
	TPSProcessing   TranslatedAuditQueueStatusType = "PROCESSING"
	TPSFailed       TranslatedAuditQueueStatusType = "FAILED"
	//Changes: (Job) Should we have a retry status?
)

// TranslatedAuditQueue is a structure that shows if an audit has, or will be processed
type TranslatedAuditQueue struct {
	baseStruct
	ChangeID int                            `json:"changeID" db:"change_id"`
	Status   TranslatedAuditQueueStatusType `json:"status" db:"status"`
	Attempts int                            `json:"attempts" db:"attempts"`
	Note     *string                        `json:"note" db:"note"`
}

func NewTranslatedAuditQueueEntry(createdBy uuid.UUID, changeID int) *TranslatedAuditQueue {
	return &TranslatedAuditQueue{
		baseStruct: NewBaseStruct(createdBy),
		ChangeID:   changeID,
		Status:     TPSQueued,
		Attempts:   0,
	}

}
