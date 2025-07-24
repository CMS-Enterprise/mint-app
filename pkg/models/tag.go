package models

import (
	"fmt"

	"github.com/google/uuid"
)

// TagType represents the posible types of tags you can have in an HTML Mention
type TagType string

// Validate checks that a valid value of TagType is returned
func (tt TagType) Validate() error {
	switch tt {
	case TagTypeUserAccount:
		return nil
	case TagTypeMTOCommonSolution:
		return nil
	}
	return fmt.Errorf("%s is not a valid value for TagType", tt)
}

// These constants represent the different values of TagType
const (
	TagTypeUserAccount       TagType = "USER_ACCOUNT"
	TagTypeMTOCommonSolution TagType = "MTO_COMMON_SOLUTION"
)

// Tag represents a reference to another data structure in the database
type Tag struct {
	baseStruct
	EntityRaw          string
	TagType            TagType    `json:"tagType" db:"tag_type"`
	TaggedField        string     `json:"taggedField" db:"tagged_field"`
	TaggedContentTable string     `json:"taggedContentTable" db:"tagged_content_table"`
	TaggedContentID    uuid.UUID  `json:"taggedContentID" db:"tagged_content_id"`
	EntityUUID         *uuid.UUID `json:"entityUUID" db:"entity_uuid"`
	EntityIntID        *int       `json:"entityIntID" db:"entity_intid"`
}

// TaggedEntity is an interface which represents if an object can be tagged or not
type TaggedEntity interface {
	IsTaggedEntity()
}
