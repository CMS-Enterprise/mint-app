package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// TranslatedAuditMetaMTOCategory represents the data about an operational need to render an operational need human readable.
type TranslatedAuditMetaMTOCategory struct {
	TranslatedAuditMetaBaseStruct
	ParentCategoryID   *uuid.UUID `json:"parentCategoryID"`
	ParentCategoryName *string    `json:"parentCategoryName"`
}

// NewTranslatedAuditMetaMTOCategory creates a New TranslatedAuditMetaMTOCategory
func NewTranslatedAuditMetaMTOCategory(version int, parentCategoryName *string, parentCategoryID *uuid.UUID) TranslatedAuditMetaMTOCategory {

	return TranslatedAuditMetaMTOCategory{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(TNOperationalNeed, version),
		ParentCategoryID:              parentCategoryID,
		ParentCategoryName:            parentCategoryName,
	}
}

// isActivityMetaData implements the IActivityMetaGeneric
func (hmb TranslatedAuditMetaMTOCategory) isAuditMetaData() {}

// IsSubCategory preovides information if this category is s subcategory base on the presence of a parent category ID
func (hmb TranslatedAuditMetaMTOCategory) IsSubCategory() bool {
	return hmb.ParentCategoryID != nil
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditMetaMTOCategory) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditMetaMTOCategory) Scan(src interface{}) error {
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
