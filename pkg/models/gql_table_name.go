package models

// GQLTableName represents the types of GQLTableName types.
type GQLTableName string

// These are the options for GQLTableName
const (
	GQTNAnalyzedaudit                GQLTableName = "analyzedAudit"
	GQTNDiscussionreply              GQLTableName = "discussionReply"
	GQTNExistingmodel                GQLTableName = "existingModel"
	GQTNExistingmodellink            GQLTableName = "existingModelLink"
	GQTNModelplan                    GQLTableName = "modelPlan"
	GQTNNdaagreement                 GQLTableName = "ndaAgreement"
	GQTNOperationalneed              GQLTableName = "operationalNeed"
	GQTNOperationalsolution          GQLTableName = "operationalSolution"
	GQTNOperationalsolutionsubtask   GQLTableName = "operationalSolutionSubtask"
	GQTNPlanbasics                   GQLTableName = "planBasics"
	GQTNPlanbeneficiaries            GQLTableName = "planBeneficiaries"
	GQTNPlancollaborator             GQLTableName = "planCollaborator"
	GQTNPlancrtdl                    GQLTableName = "planCrTdl"
	GQTNPlandiscussion               GQLTableName = "planDiscussion"
	GQTNPlandocument                 GQLTableName = "planDocument"
	GQTNPlandocumentsolutionlink     GQLTableName = "planDocumentSolutionLink"
	GQTNPlangeneralcharacteristics   GQLTableName = "planGeneralCharacteristics"
	GQTNPlanopsevalandlearning       GQLTableName = "planOpsEvalAndLearning"
	GQTNPlanparticipantsandproviders GQLTableName = "planParticipantsAndProviders"
	GQTNPlanpayments                 GQLTableName = "planPayments"
	GQTNPossibleoperationalneed      GQLTableName = "possibleOperationalNeed"
	GQTNPossibleoperationalsolution  GQLTableName = "possibleOperationalSolution"
	GQTNUseraccount                  GQLTableName = "userAccount"
	GQTNTimeline                     GQLTableName = "timeline"
)
