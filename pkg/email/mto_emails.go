package email

// mtoCommonSolutionEmails contains all MTOCommonSolution email templates
type mtoCommonSolutionEmails struct {
	// SystemOwner emails for MTOCommonSolution
	SystemOwner mtoCommonSolutionSystemOwnerEmails
	// POC emails for MTOCommonSolution
	POC mtoCommonSolutionPOCEmails
	// Contractor emails for MTOCommonSolution
	Contractor mtoCommonSolutionContractorEmails
}

// mtoEmails contains all MTO-related email templates
type mtoEmails struct {
	CommonMilestone mtoCommonMilestoneEmails
	CommonSolution  mtoCommonSolutionEmails
	Milestone       mtoMilestoneEmails
	Solution        mtoSolutionEmails
}

// MTO is the collection of all MTO-related email templates
var MTO = mtoEmails{
	CommonMilestone: mtoCommonMilestone,
	CommonSolution: mtoCommonSolutionEmails{
		SystemOwner: mtoCommonSolutionSystemOwner,
		POC:         mtoCommonSolutionPOC,
		Contractor:  mtoCommonSolutionContractor,
	},
	Milestone: mtoMilestones,
	Solution:  mtoSolutions,
}
