package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_milestone/get_by_id.sql
var mtoCommonMilestoneGetByIDSQL string

type mtoCommonMilestoneScripts struct {
	GetByID string
}

// MTOCommonMilestone contains all the SQL queries for the MTO common milestone
var MTOCommonMilestone = mtoCommonMilestoneScripts{
	GetByID: mtoCommonMilestoneGetByIDSQL,
}
