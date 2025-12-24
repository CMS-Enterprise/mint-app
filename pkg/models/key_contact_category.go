package models

import (
	"github.com/google/uuid"
)

type KeyContactCategory struct {
	baseStruct
	Name string `json:"name" db:"name"`
}

func NewKeyContactCategory(createdBy uuid.UUID, name string) *KeyContactCategory {
	return &KeyContactCategory{
		baseStruct: NewBaseStruct(createdBy),
		Name:       name,
	}
}
