package email

// mtoCommonSolutionEmails contains all MTOCommonSolution email templates
type mtoCommonSolutionEmails struct {
	// SystemOwner emails for MTOCommonSolution
	SystemOwner mtoCommonSolutionSystemOwnerEmails
}

// mtoEmails contains all MTO-related email templates
type mtoEmails struct {
	// CommonSolution emails for MTO
	CommonSolution mtoCommonSolutionEmails
}

// MTO is the collection of all MTO-related email templates
var MTO = mtoEmails{
	CommonSolution: mtoCommonSolutionEmails{
		SystemOwner: mtoCommonSolutionSystemOwner,
	},
}
