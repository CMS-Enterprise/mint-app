package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// TranslatedAuditMetaDiscussionReply represents the content needed to make a discussion reply meta data readable.
type TranslatedAuditMetaDiscussionReply struct {
	TranslatedAuditMetaBaseStruct
	discussionRelation
	DiscussionContent string `json:"discussionContent"`
	NumberOfReplies   int    `json:"numberOfReplies"`
}

// NewTranslatedAuditMetaDiscussionReply creates a New TranslatedAuditMetaDiscussionReply
func NewTranslatedAuditMetaDiscussionReply(tableName string, version int, discussionID uuid.UUID, discussionContent string, numberOfReplies int) TranslatedAuditMetaDiscussionReply {

	return TranslatedAuditMetaDiscussionReply{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(tableName, version),
		discussionRelation:            NewDiscussionRelation(discussionID),
		DiscussionContent:             discussionContent,
		NumberOfReplies:               numberOfReplies,
	}
}

// isActivityMetaData implements the IActivityMetaGeneric
func (hmb TranslatedAuditMetaDiscussionReply) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditMetaDiscussionReply) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditMetaDiscussionReply) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, hmb)
	if err != nil {
		return err
	}

	return nil
}
