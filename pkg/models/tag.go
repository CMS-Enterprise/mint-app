package models

import "github.com/google/uuid"

// Tag represents a reference to another data structure in the database
type Tag struct {
	baseStruct
	TagType         TagType    `json:"tagType" db:"tag_type"`
	TaggedContentID uuid.UUID  `json:"taggedContentID" db:"tagged_content_id"`
	EntityUUID      *uuid.UUID `json:"entityUUID" db:"entity_uuid"`
	EntityIntID     *int       `json:"entityIntID" db:"entity_intid"`
}
