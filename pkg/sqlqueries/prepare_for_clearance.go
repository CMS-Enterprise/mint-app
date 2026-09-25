package sqlqueries

import _ "embed"

//go:embed SQL/prepare_for_clearance/get_by_model_plan_id.sql
var prepareForClearanceGetByModelPlanID string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_plan_basics.sql
var prepareForClearanceClearReadyForClearancePlanBasics string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_plan_general_characteristics.sql
var prepareForClearanceClearReadyForClearancePlanGeneralCharacteristics string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_plan_participants_and_providers.sql
var prepareForClearanceClearReadyForClearancePlanParticipantsAndProviders string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_plan_beneficiaries.sql
var prepareForClearanceClearReadyForClearancePlanBeneficiaries string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_plan_ops_eval_and_learning.sql
var prepareForClearanceClearReadyForClearancePlanOpsEvalAndLearning string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_plan_payments.sql
var prepareForClearanceClearReadyForClearancePlanPayments string

//go:embed SQL/prepare_for_clearance/clear_ready_for_clearance_plan_timeline.sql
var prepareForClearanceClearReadyForClearancePlanTimeline string

type prepareForClearanceScripts struct {
	GetByModelPlanID                                   string
	ClearReadyForClearancePlanBasics                   string
	ClearReadyForClearancePlanGeneralCharacteristics   string
	ClearReadyForClearancePlanParticipantsAndProviders string
	ClearReadyForClearancePlanBeneficiaries            string
	ClearReadyForClearancePlanOpsEvalAndLearning       string
	ClearReadyForClearancePlanPayments                 string
	ClearReadyForClearancePlanTimeline                 string
}

// PrepareForClearance houses all the sql for getting data for prepare for clearance from the database
var PrepareForClearance = prepareForClearanceScripts{
	GetByModelPlanID:                                   prepareForClearanceGetByModelPlanID,
	ClearReadyForClearancePlanBasics:                   prepareForClearanceClearReadyForClearancePlanBasics,
	ClearReadyForClearancePlanGeneralCharacteristics:   prepareForClearanceClearReadyForClearancePlanGeneralCharacteristics,
	ClearReadyForClearancePlanParticipantsAndProviders: prepareForClearanceClearReadyForClearancePlanParticipantsAndProviders,
	ClearReadyForClearancePlanBeneficiaries:            prepareForClearanceClearReadyForClearancePlanBeneficiaries,
	ClearReadyForClearancePlanOpsEvalAndLearning:       prepareForClearanceClearReadyForClearancePlanOpsEvalAndLearning,
	ClearReadyForClearancePlanPayments:                 prepareForClearanceClearReadyForClearancePlanPayments,
	ClearReadyForClearancePlanTimeline:                 prepareForClearanceClearReadyForClearancePlanTimeline,
}
