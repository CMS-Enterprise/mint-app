package models

import "github.com/google/uuid"

// TemplateRelation is a struct meant to be embedded to show that the object should have template relations enforced
type templateRelation struct {
	TemplateID uuid.UUID `json:"templateID" db:"template_id"`
}

// NewTemplateRelation returns a template relation object
func NewTemplateRelation(templateID uuid.UUID) templateRelation {
	return templateRelation{
		TemplateID: templateID,
	}
}

// GetTemplateID returns the templateID of the object
func (t templateRelation) GetTemplateID() uuid.UUID {
	return t.TemplateID
}
