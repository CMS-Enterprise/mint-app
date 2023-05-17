package models

import "github.com/google/uuid"

// IOperationalNeedRelation is an interface that represents models that are related to an operational need.
type IOperationalNeedRelation interface {
	GetOperationalNeedID() uuid.UUID
}

// operationalNeedRelation is an embedded struct meant to satisify the IOperationalNeedRelation interface
type operationalNeedRelation struct {
	OperationalNeedID uuid.UUID `json:"operationalNeedID" db:"operational_need_id"`
}

// NewOperationalNeedRelation returns a operational need relation object
func NewOperationalNeedRelation(operationalNeedID uuid.UUID) operationalNeedRelation {
	return operationalNeedRelation{
		OperationalNeedID: operationalNeedID,
	}
}

// GetOperationalNeedID returns OperationalID
func (d operationalNeedRelation) GetOperationalNeedID() uuid.UUID {
	return d.OperationalNeedID
}
