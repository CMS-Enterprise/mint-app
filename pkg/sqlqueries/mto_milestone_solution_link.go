package sqlqueries

import _ "embed"

//go:embed SQL/mto/milestone_solution_link/create.sql
var mtoMilestoneCreateMilestoneSolutionLinkSQL string

//go:embed SQL/mto/milestone_solution_link/get_by_milestone_id.sql
var mtoMilestoneGetMilestoneSolutionLinksByMilestoneIDSQL string

//go:embed SQL/mto/milestone_solution_link/merge_solutions_to_milestone.sql
var mtoMilestoneSolutionLinkMergeSolutionsToMilestonesSQL string

//go:embed SQL/mto/milestone_solution_link/link_milestones_to_solution.sql
var mtoSolutionLinkMilestonesToSolutionSQL string

type mtoMilestoneSolutionLinkScripts struct {
	// creates a link between a milestone and a solution and returns the link ID
	Create string
	// returns all milestone-solution links for a given milestone by ID
	GetByMilestoneID string
	// Takes an array of solution_ids and a milestone_id and performs a merge to ensure only these solutions are listed to that milestone
	MergeSolutionsToMilestones string
	// Takes an array of milestone_ids and a solution_id and performs a merge to ensure only these milestones are listed to that solution
	LinkMilestonesToSolution string
}

var MTOMilestoneSolutionLink = mtoMilestoneSolutionLinkScripts{
	Create:                     mtoMilestoneCreateMilestoneSolutionLinkSQL,
	GetByMilestoneID:           mtoMilestoneGetMilestoneSolutionLinksByMilestoneIDSQL,
	MergeSolutionsToMilestones: mtoMilestoneSolutionLinkMergeSolutionsToMilestonesSQL,
	LinkMilestonesToSolution:   mtoSolutionLinkMilestonesToSolutionSQL,
}
