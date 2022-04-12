package models

import (
	"time"

	"github.com/google/uuid"
)

type ModelPlan struct {
	ID                      uuid.UUID  `json:"id" db:"id"`
	Requester               *string    `json:"requester" db:"requester"`
	RequesterComponent      *string    `json:"requesterComponent" db:"requester_component"`
	MainPointOfContact      *string    `json:"mainPointOfContact" db:"main_point_of_contact"`
	PointOfContactComponent *string    `json:"pointOfContactComponent" db:"point_of_contact_component"`
	CreatedBy               *string    `json:"createdBy" db:"created_by"`
	CreatedDts              *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy              *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts             *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// type ModelPlanInput ModelPlan
