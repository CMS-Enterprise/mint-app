package mappings

import "fmt"

// GetTranslation allows programmatic access to return a translation for a given table name
func GetTranslation(tableName string) (Translation, error) {

	switch tableName {
	case "model_plan":
		return ModelPlanTranslation()
	case "plan_participants_and_providers":
		return ParticipantsAndProvidersTranslation()
	case "plan_basics":
		return PlanBasicsTranslation()
	case "plan_payments":
		return PlanPaymentsTranslation()
	case "plan_ops_eval_and_learning":
		return PlanOpsEvalAndLearningTranslation()
	case "plan_general_characteristics":
		return PlanGeneralCharacteristicsTranslation()
	case "plan_collaborator":
		return PlanCollaboratorsTranslation()
	case "plan_beneficiaries":
		return PlanBeneficiariesTranslation()

	default:
		return nil, fmt.Errorf("no translation for table: %s ", tableName)

	}

}
