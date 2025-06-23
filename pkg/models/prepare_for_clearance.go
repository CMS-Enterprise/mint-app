package models

import "time"

// PrepareForClearanceResponse represents a response from the ReadyForClearanceGetByModelPlanID store method
// It does _NOT_ represent anything in the GraphQL response, it only exists to calculate values for the GraphQL resolver.
type PrepareForClearanceResponse struct {
	MostRecentClearanceDts      *time.Time `db:"most_recent_clearance_dts"`
	PlanTimelineClearanceStarts *time.Time `db:"clearance_starts"`
	AllReadyForClearance        bool       `db:"all_ready_for_clearance"`
}
