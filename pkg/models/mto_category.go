package models

import "github.com/google/uuid"

type MTOCategory struct {
	baseStruct
	modelPlanRelation

	Name     string    `json:"name" db:"name"`
	ParentID uuid.UUID `json:"parent_id" db:"parent_id"`
}

// MTOSubcategory is the same as a MTOCategory in the database. It is separated here so we can be precise in graphql
type MTOSubcategory MTOCategory

// IsUncategorized returns if a category is an actual category, or if it is a placeholder category that is not store in the database
func (m MTOCategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}

// IsUncategorized returns if a category is an actual subcategory, or if it is a placeholder subcategory that is not store in the database
func (m MTOSubcategory) IsUncategorized() bool {
	return m.ID == uuid.Nil
}
