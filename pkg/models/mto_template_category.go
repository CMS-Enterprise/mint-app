package models

import "github.com/google/uuid"

type MTOTemplateCategory struct {
	baseStruct

	TemplateID uuid.UUID  `json:"templateID" db:"template_id"`
	Name       string     `json:"name"       db:"name"`
	ParentID   *uuid.UUID `json:"parentID"   db:"parent_id"`
	Order      int        `json:"order"      db:"order"`
}

// MTOTemplateSubCategory is the same as a MTOTemplateCategory in the database. It is separated here so we can be precise in graphql
type MTOTemplateSubCategory MTOTemplateCategory

// NewMTOTemplateCategory returns a new MTOTemplateCategory object
func NewMTOTemplateCategory(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	name string,
	parentID *uuid.UUID,
	order int,
) *MTOTemplateCategory {
	return &MTOTemplateCategory{
		baseStruct: NewBaseStruct(createdBy),
		TemplateID: templateID,
		Name:       name,
		ParentID:   parentID,
		Order:      order,
	}
}

// NewMTOTemplateSubCategory returns a new MTOTemplateSubCategory object
func NewMTOTemplateSubCategory(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	name string,
	order int,
) *MTOTemplateSubCategory {
	return &MTOTemplateSubCategory{
		baseStruct: NewBaseStruct(createdBy),
		TemplateID: templateID,
		Name:       name,
		Order:      order,
	}
}

// IsUncategorized returns if a category is an actual category, or if it is a placeholder category that is not store in the database
func (m MTOTemplateCategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}

// IsUncategorized returns if a category is an actual subcategory, or if it is a placeholder subcategory that is not store in the database
func (m MTOTemplateSubCategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}
