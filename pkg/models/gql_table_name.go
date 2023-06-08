package models

// GQLTableName represents the types of GQLTableName types.
type GQLTableName string

// These are the options for GQLTableName
const (
	GQTNAnalyzedaudit                GQLTableName = "AnalyzedAudit"
	GQTNDiscussionreply              GQLTableName = "DiscussionReply"
	GQTNExistingmodel                GQLTableName = "ExistingModel"
	GQTNExistingmodellink            GQLTableName = "ExistingModelLink"
	GQTNModelplan                    GQLTableName = "ModelPlan"
	GQTNNdaagreement                 GQLTableName = "NdaAgreement"
	GQTNOperationalneed              GQLTableName = "OperationalNeed"
	GQTNOperationalsolution          GQLTableName = "OperationalSolution"
	GQTNOperationalsolutionsubtask   GQLTableName = "OperationalSolutionSubtask"
	GQTNPlanbasics                   GQLTableName = "PlanBasics"
	GQTNPlanbeneficiaries            GQLTableName = "PlanBeneficiaries"
	GQTNPlancollaborator             GQLTableName = "PlanCollaborator"
	GQTNPlancrtdl                    GQLTableName = "PlanCrTdl"
	GQTNPlandiscussion               GQLTableName = "PlanDiscussion"
	GQTNPlandocument                 GQLTableName = "PlanDocument"
	GQTNPlandocumentsolutionlink     GQLTableName = "PlanDocumentSolutionLink"
	GQTNPlangeneralcharacteristics   GQLTableName = "PlanGeneralCharacteristics"
	GQTNPlanopsevalandlearning       GQLTableName = "PlanOpsEvalAndLearning"
	GQTNPlanparticipantsandproviders GQLTableName = "PlanParticipantsAndProviders"
	GQTNPlanpayments                 GQLTableName = "PlanPayments"
	GQTNPossibleoperationalneed      GQLTableName = "PossibleOperationalNeed"
	GQTNPossibleoperationalsolution  GQLTableName = "PossibleOperationalSolution"
	GQTNUseraccount                  GQLTableName = "UserAccount"
)
