package main

import "github.com/cmsgov/mint-app/pkg/models"

// BackfillEntry represents a logical collection of
type BackfillEntry struct {
	ModelPlan                    models.ModelPlan
	PlanBasics                   models.PlanBasics
	PlanGeneralCharacteristics   models.PlanGeneralCharacteristics
	PlanParticipantsAndProviders models.PlanParticipantsAndProviders
	PlanBeneficiaries            models.PlanBeneficiaries
	PlanOpsEvalAndLearning       models.PlanOpsEvalAndLearning
	PlanPayments                 models.PlanPayments

	//	Documents   models.PlanDocument
	// Discussions models.PlanDiscussion
	// ItTools                  models.PlanITTools

	// Collaborators            models.PlanCollaborator
}

// NewBackFillEntry instantiates a BackfillEntry
func NewBackFillEntry() BackfillEntry {

	return BackfillEntry{
		ModelPlan:                    models.ModelPlan{},
		PlanBasics:                   models.PlanBasics{},
		PlanGeneralCharacteristics:   models.PlanGeneralCharacteristics{},
		PlanParticipantsAndProviders: models.PlanParticipantsAndProviders{},
		PlanBeneficiaries:            models.PlanBeneficiaries{},
		PlanOpsEvalAndLearning:       models.PlanOpsEvalAndLearning{},
		PlanPayments:                 models.PlanPayments{},
	}

	// return BackfillEntry{
	// 	ModelPlan:                models.NewModelPlan(),
	// 	Basics:                   models.NewPlanBasics(),
	// 	GeneralCharacteristics:   models.NewPlanGeneralCharacteristics(),
	// 	ParticipantsAndProviders: models.NewPlanParticipantsAndProviders(),
	// 	Beneficiaries:            models.NewPlanBeneficiaries(),
	// 	OpsEvalAndLearning:       models.NewPlanOpsEvalAndLearning(),
	// 	Payments:                 models.NewPlanPayments(),
	// }
}
