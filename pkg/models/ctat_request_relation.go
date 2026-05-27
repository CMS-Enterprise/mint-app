package models

import "github.com/google/uuid"

// ICTATRequestRelation is an interface for models related to a CTAT request.
type ICTATRequestRelation interface {
	GetCTATRequestID() uuid.UUID
}

// ctatRequestRelation is an embedded struct for CTAT request child records.
type ctatRequestRelation struct {
	CTATRequestID uuid.UUID `json:"ctatRequestId" db:"ctat_request_id" gqlgen:"ctatRequestId"`
}

// NewCTATRequestRelation returns a CTAT request relation object.
func NewCTATRequestRelation(ctatRequestID uuid.UUID) ctatRequestRelation {
	return ctatRequestRelation{
		CTATRequestID: ctatRequestID,
	}
}

// GetCTATRequestID returns the CTAT request ID.
func (c ctatRequestRelation) GetCTATRequestID() uuid.UUID {
	return c.CTATRequestID
}
