package models

import (
	"github.com/google/uuid"
)

type KeyContactCategory struct {
	baseStruct
	Category string `json:"category" db:"category"`
}

func NewKeyContactCategory(createdBy uuid.UUID, category string) *KeyContactCategory {
	return &KeyContactCategory{
		baseStruct: NewBaseStruct(createdBy),
		Category:   category,
	}
}
