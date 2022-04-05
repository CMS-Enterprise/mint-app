package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
)

type PlanBasics struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	ModelName     null.String `json:"modelName" db:"model_name"`
	ModelCategory null.String `json:"modelCategory" db:"model_category"`
	CMSCenter     null.String `json:"cmsCenter" db:"cms_center"`
	CMMIGroup     null.String `json:"cmmiGroup" db:"cmmi_group"`
	ModelType     null.String `json:"modelType" db:"model_type"`

	Problem        null.String `json:"problem" db:"problem"`
	Goal           null.String `json:"goal" db:"goal"`
	TestInventions null.String `json:"testInventions" db:"test_inventions"`
	Note           null.String `json:"note" db:"note"`

	CreatedBy   null.String `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  null.String `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time  `json:"modifiedDts" db:"modified_dts"`
}
