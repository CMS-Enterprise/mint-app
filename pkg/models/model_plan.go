package models

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
)

// ModelPlan is the top-level object for an entire draft model plan
type ModelPlan struct {
	ID            uuid.UUID      `json:"id" db:"id"`
	ModelName     string         `json:"modelName" db:"model_name"`
	ModelCategory *ModelCategory `json:"modelCategory" db:"model_category"`
	CMSCenters    CMSCenterG     `json:"cmsCenters" db:"cms_centers"`
	CMSOther      *string        `json:"cmsOther" db:"cms_other"`
	CMMIGroups    CMMIGroupG     `json:"cmmiGroups" db:"cmmi_groups"`
	Archived      bool           `json:"archived" db:"archived"`
	Status        ModelStatus    `json:"status" db:"status"`
	CreatedBy     string         `json:"createdBy" db:"created_by"`
	CreatedDts    time.Time      `json:"createdDts" db:"created_dts"`
	ModifiedBy    *string        `json:"modifiedBy" db:"modified_by"`
	ModifiedDts   *time.Time     `json:"modifiedDts" db:"modified_dts"`
}

//CMSCenterG is an array of CMSCenter
type CMSCenterG []CMSCenter

//CMMIGroupG is an array of CMMIGroup
type CMMIGroupG []CMMIGroup

// GetModelTypeName returns a string name that represents the ModelPlan struct
func (m ModelPlan) GetModelTypeName() string {
	return "Model_Plan"
}

// GetPlanID returns the ModifiedBy property for a ModelPlan struct
func (m ModelPlan) GetPlanID() uuid.UUID {
	return m.ID
}

// GetModifiedBy returns the ModifiedBy property for a ModelPlan struct
func (m ModelPlan) GetModifiedBy() *string {
	return m.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (m ModelPlan) GetCreatedBy() string {
	return m.CreatedBy
}

//Scan is used by sql.scan to read the values from the DB
func (a *CMSCenterG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

// Value implements the driver.Valuer interface.
func (a CMSCenterG) Value() (driver.Value, error) {
	return GenericValue(a)
}

//Scan is used by sql.scan to read the values from the DB
func (a *CMMIGroupG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

// Value implements the driver.Valuer interface.
func (a CMMIGroupG) Value() (driver.Value, error) {
	return GenericValue(a)
}
