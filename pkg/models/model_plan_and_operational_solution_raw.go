package models

import (
	"time"

	"github.com/google/uuid"
)

// ModelPlanAndOperationalSolutionRaw represents the combined data from the SQL query with unique field names
type ModelPlanAndOperationalSolutionRaw struct {
	SolKey                         string     `db:"sol_key"`
	SolName                        string     `db:"sol_name"`
	OperationalSolutionID          uuid.UUID  `db:"operational_solution_id"`
	OperationalNeedID              uuid.UUID  `db:"operational_need_id"`
	Needed                         *bool      `db:"needed"`
	SolutionType                   *int       `db:"solution_type"`
	NameOther                      *string    `db:"name_other"`
	PocName                        *string    `db:"poc_name"`
	PocEmail                       *string    `db:"poc_email"`
	MustStartDts                   *time.Time `db:"must_start_dts"`
	MustFinishDts                  *time.Time `db:"must_finish_dts"`
	IsOther                        *bool      `db:"is_other"`
	IsCommonSolution               *bool      `db:"is_common_solution"`
	OtherHeader                    *string    `db:"other_header"`
	OperationalSolutionStatus      string     `db:"operational_solution_status"`
	OperationalSolutionCreatedBy   uuid.UUID  `db:"operational_solution_created_by"`
	OperationalSolutionCreatedDts  time.Time  `db:"operational_solution_created_dts"`
	OperationalSolutionModifiedBy  *uuid.UUID `db:"operational_solution_modified_by"`
	OperationalSolutionModifiedDts *time.Time `db:"operational_solution_modified_dts"`
	ModelPlanID                    uuid.UUID  `db:"model_plan_id"`
	ModelName                      string     `db:"model_name"`
	Abbreviation                   *string    `db:"abbreviation"`
	ModelPlanStatus                string     `db:"model_plan_status"`
	Archived                       bool       `db:"archived"`
	ModelPlanCreatedBy             uuid.UUID  `db:"model_plan_created_by"`
	ModelPlanCreatedDts            time.Time  `db:"model_plan_created_dts"`
	ModelPlanModifiedBy            *uuid.UUID `db:"model_plan_modified_by"`
	ModelPlanModifiedDts           *time.Time `db:"model_plan_modified_dts"`
}
