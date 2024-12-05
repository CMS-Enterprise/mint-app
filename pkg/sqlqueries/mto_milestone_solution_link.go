package sqlqueries

import _ "embed"

//go:embed SQL/mto/milestone_solution_link/create.sql
var mtoMilestoneCreateMilestoneSolutionLinkSQL string

//go:embed SQL/mto/milestone_solution_link/get_by_milestone_id.sql
var mtoMilestoneGetMilestoneSolutionLinksByMilestoneIDSQL string

type mtoMilestoneSolutionLinkScripts struct {
	// creates a link between a milestone and a solution and returns the link ID
	Create string
	// returns all milestone-solution links for a given milestone by ID
	GetByMilestoneID string
}

var MTOMilestoneSolutionLink = mtoMilestoneSolutionLinkScripts{
	Create:           mtoMilestoneCreateMilestoneSolutionLinkSQL,
	GetByMilestoneID: mtoMilestoneGetMilestoneSolutionLinksByMilestoneIDSQL,
}
