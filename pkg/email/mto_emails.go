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
	// CommonSolution emails for MTO
	CommonSolution mtoCommonSolutionEmails
	Milestone      mtoMilestoneEmails
	Solution       mtoSolutionEmails
}

// MTO is the collection of all MTO-related email templates
var MTO = mtoEmails{
	CommonSolution: mtoCommonSolutionEmails{
		SystemOwner: mtoCommonSolutionSystemOwner,
		POC:         mtoCommonSolutionPOC,
		Contractor:  mtoCommonSolutionContractor,
	},
	Milestone: mtoMilestones,
	Solution:  mtoSolutions,
}
