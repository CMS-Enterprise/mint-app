package models

import (
	"time"

	"github.com/google/uuid"
)

type PlanBasics struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	ModelType *ModelType `json:"modelType" db:"model_type"`

	Problem        *string `json:"problem" db:"problem"`
	Goal           *string `json:"goal" db:"goal"`
	TestInventions *string `json:"testInventions" db:"test_inventions"`
	Note           *string `json:"note" db:"note"`

	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

func (p *PlanBasics) CalcStatus() (e error) {

	//TODO look into making a generic function that takes in any parent class object and calcs status
	fieldCount := 5
	filledField := 0
	decidedStat := TaskReady

	if p.ModelType != nil {
		filledField++
	}

	if p.Problem != nil {
		filledField++
	}
	if p.Goal != nil {
		filledField++
	}
	if p.TestInventions != nil {
		filledField++
	}
	if p.Note != nil {
		filledField++
	}

	if filledField == fieldCount {
		decidedStat = TaskComplete

	} else if filledField > 0 {
		decidedStat = TaskInProgress
	}
	p.Status = decidedStat
	return nil
}
