package models

import (
	"github.com/google/uuid"
)

type KeyContact struct {
	baseStruct
	MailboxTitle   *string `db:"mailbox_title" json:"mailboxTitle"`
	MailboxAddress *string `db:"mailbox_address" json:"mailboxAddress"`
	// These are convenience fields, they are not stored in the database, they are sourced from user account
	Name  *string `db:"name" json:"name"`
	Email *string `db:"email" json:"email"`
	// -----------------------------------------------------------------------------------------------------
	userIDRelationPtr
	SubjectArea       string    `db:"subject_area" json:"subjectArea"`
	SubjectCategoryID uuid.UUID `db:"subject_category_id" json:"subjectCategoryId"`
}

// NewKeyContact returns a new KeyContact object
func NewKeyContact(
	createdBy uuid.UUID,
	mailboxTitle *string,
	mailboxAddress *string,
	userID *uuid.UUID,
	subjectArea string,
	subjectCategoryID uuid.UUID,
) *KeyContact {
	return &KeyContact{
		baseStruct:        NewBaseStruct(createdBy),
		MailboxTitle:      mailboxTitle,
		MailboxAddress:    mailboxAddress,
		userIDRelationPtr: NewUserIDRelationPtr(userID),
		SubjectArea:       subjectArea,
		SubjectCategoryID: subjectCategoryID,
	}
}
