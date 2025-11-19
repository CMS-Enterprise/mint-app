package models

import (
	"github.com/google/uuid"
)

type KeyContact struct {
	baseStruct
	MailboxTitle   *string `db:"mailbox_title" json:"mailboxTitle"`
	MailboxAddress *string `db:"mailbox_address" json:"mailboxAddress"`
	// These are convenience fields, they are not stored in the database, they are sourced from user account
	Name  string `db:"name" json:"name"`
	Email string `db:"email" json:"email"`
	// -----------------------------------------------------------------------------------------------------
	userIDRelationPtr
	IsTeam          bool   `db:"is_team" json:"isTeam"`
	SubjectArea     string `db:"subject_area" json:"subjectArea"`
	SubjectCategory string `db:"category" json:"category"`
}

// NewKeyContact returns a new KeyContact object
func NewKeyContact(
	createdBy uuid.UUID,
	mailboxTitle *string,
	mailboxAddress *string,
	userID *uuid.UUID,
	isTeam bool,
	subjectArea string,
	subjectCategory string,
) *KeyContact {
	return &KeyContact{
		baseStruct:        NewBaseStruct(createdBy),
		MailboxTitle:      mailboxTitle,
		MailboxAddress:    mailboxAddress,
		userIDRelationPtr: NewUserIDRelationPtr(userID),
		IsTeam:            isTeam,
		SubjectArea:       subjectArea,
		SubjectCategory:   subjectCategory,
	}
}
