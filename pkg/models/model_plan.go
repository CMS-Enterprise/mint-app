package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

type ModelPlan struct {
	ID                      uuid.UUID   `json:"id" db:"id"`
	Requester               null.String `json:"requester" db:"requester"`
	RequesterComponent      null.String `json:"requesterComponent" db:"requester_component"`
	MainPointOfContact      null.String `json:"mainPointOfContact" db:"main_point_of_contact"`
	PointOfContactComponent null.String `json:"pointOfContactComponent" db:"point_of_contact_component"`
	CreatedBy               null.String `json:"createdBy" db:"created_by"`
	CreatedDts              *time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy              null.String `json:"modifiedBy" db:"modified_by"`
	ModifiedDts             *time.Time  `json:"modifiedDts" db:"modified_dts"`
}
