package sqlqueries

import _ "embed"

//go:embed SQL/mto/suggested_milestone_reason/get_by_mto_suggested_milestone_id_LOADER.sql
var mtoSuggestedMilestoneReasonGetByMTOSuggestedMilestoneIDLoaderSQL string

type mtoSuggestedMilestoneReasonScripts struct {
	GetByMTOSuggestedMilestoneIDLoader string
}

// MTOSuggestedMilestoneReason contains all SQL queries for the MTO suggested milestone reason
var MTOSuggestedMilestoneReason = mtoSuggestedMilestoneReasonScripts{
	GetByMTOSuggestedMilestoneIDLoader: mtoSuggestedMilestoneReasonGetByMTOSuggestedMilestoneIDLoaderSQL,
}
