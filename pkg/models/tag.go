package models

import "github.com/google/uuid"

// Tag represents a reference to another data structure in the database
type Tag struct {
	baseStruct
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

// TaggedContent represents raw tagged content, as well as the data connections represented by it
type TaggedContent struct {
	RawContent string `json:"rawContent"`
	Tags       []*Tag `json:"tags"`
}
