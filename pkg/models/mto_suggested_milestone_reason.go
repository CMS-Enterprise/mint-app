package models

import "github.com/google/uuid"

// MilestoneSuggestionReasonTable is an enum of database tables that can trigger MTO milestone suggestions
type MilestoneSuggestionReasonTable string

// These constants correspond to the mto_milestone_suggestion_reason_table PostgreSQL enum created in V260
const (
	MilestoneSuggestionReasonTableIddocQuestionnaire           MilestoneSuggestionReasonTable = "iddoc_questionnaire"
	MilestoneSuggestionReasonTablePlanBasics                   MilestoneSuggestionReasonTable = "plan_basics"
	MilestoneSuggestionReasonTablePlanBeneficiaries            MilestoneSuggestionReasonTable = "plan_beneficiaries"
	MilestoneSuggestionReasonTablePlanGeneralCharacteristics   MilestoneSuggestionReasonTable = "plan_general_characteristics"
	MilestoneSuggestionReasonTablePlanOpsEvalAndLearning       MilestoneSuggestionReasonTable = "plan_ops_eval_and_learning"
	MilestoneSuggestionReasonTablePlanParticipantsAndProviders MilestoneSuggestionReasonTable = "plan_participants_and_providers"
	MilestoneSuggestionReasonTablePlanPayments                 MilestoneSuggestionReasonTable = "plan_payments"
)

// MTOSuggestedMilestoneReason represents a single per-field reason why a milestone was suggested.
// Each row corresponds to one (trigger_col, trigger_val) pair that matched a trigger condition.
type MTOSuggestedMilestoneReason struct {
	baseStruct
	MTOSuggestedMilestoneID uuid.UUID                      `json:"mtoSuggestedMilestoneID" db:"mto_suggested_milestone_id"`
	TriggerTable            MilestoneSuggestionReasonTable `json:"triggerTable" db:"trigger_table"`
	// TriggerCol is the individual column name (e.g. "manage_part_c_d_enrollment")
	TriggerCol string `json:"triggerCol" db:"trigger_col"`
	// TriggerVal is the raw database value that matched the trigger condition (e.g. "t" for boolean true).
	// Note: this is the internal DB representation, not the human-readable answer label shown in the UI.
	// Future Enhancement: translate trigger_val to a human-readable answer using the translation layer.
	TriggerVal string `json:"triggerVal" db:"trigger_val"`
}
