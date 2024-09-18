package mappings

import (
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// Note, these could all translation live in a exported map, however, having them separate enable much more granular testing.

// GetTranslation allows programmatic access to return a translation for a given table name
func GetTranslation(tableName models.TableName) (Translation, error) {
	switch tableName {
	case models.TNModelPlan:
		return ModelPlanTranslation()
	case models.TNPlanParticipantsAndProviders:
		return PlanParticipantsAndProvidersTranslation()
	case models.TNPlanBasics:
		return PlanBasicsTranslation()
	case models.TNPlanPayments:
		return PlanPaymentsTranslation()
	case models.TNPlanOpsEvalAndLearning:
		return PlanOpsEvalAndLearningTranslation()
	case models.TNPlanGeneralCharacteristics:
		return PlanGeneralCharacteristicsTranslation()
	case models.TNPlanCollaborator:
		return PlanCollaboratorTranslation()
	case models.TNPlanBeneficiaries:
		return PlanBeneficiariesTranslation()
	case models.TNPlanDocument:
		return PlanDocumentTranslation()
	case models.TNOperationalNeed:
		return OperationalNeedTranslation()
	case models.TNOperationalSolution:
		return OperationalSolutionTranslation()
	case models.TNOperationalSolutionSubtask:
		return OperationalSolutionSubtaskTranslation()
	case models.TNPlanDiscussion:
		return PlanDiscussionTranslation()
	case models.TNDiscussionReply:
		return DiscussionReplyTranslation()
	case models.TNPlanCr:
		return PlanCRTranslation()
	case models.TNPlanTdl:
		return PlanTDLTranslation()
	case models.TNExistingModelLink:
		return ExistingModelLinkTranslation()
	case models.TNPlanDocumentSolutionLink:
		return PlanDocumentSolutionLinkTranslation()
	default:

		return nil, fmt.Errorf("no translation for table: %s ", tableName)

	}

}

// UnknownTranslation is the default translation returned when there isn't a translation. This effectively just lets the raw data be returned in liu of a translation
type UnknownTranslation struct {
	tableName string
}

// ToMap translates this translation to a map, satisfying the Translation interface
func (ut *UnknownTranslation) ToMap() (map[string]models.ITranslationField, error) {
	return map[string]models.ITranslationField{}, nil
}

// TableName returns the table name for this translation, satisfying the Translation interface
func (ut *UnknownTranslation) TableName() string {
	return ut.tableName
}
