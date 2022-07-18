package models

import (
	"github.com/lib/pq"
)

// ModelPlan is the top-level object for an entire draft model plan
type ModelPlan struct {
	BaseStruct
	ModelName     string         `json:"modelName" db:"model_name"`
	ModelCategory *ModelCategory `json:"modelCategory" db:"model_category"`
	CMSCenters    pq.StringArray `json:"cmsCenters" db:"cms_centers"`
	CMSOther      *string        `json:"cmsOther" db:"cms_other"`
	CMMIGroups    pq.StringArray `json:"cmmiGroups" db:"cmmi_groups"`
	Archived      bool           `json:"archived" db:"archived"`
	Status        ModelStatus    `json:"status" db:"status"`
}
