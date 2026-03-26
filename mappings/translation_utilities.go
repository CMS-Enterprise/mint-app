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
	case models.TNPlanDataExchangeApproach:
		return PlanDataExchangeApproachTranslation()
	case models.TNIddocQuestionnaire:
		return IddocQuestionnaireTranslation()
	// MTO TABLES
	case models.TNMTOCategory:
		return MTOCategoryTranslation()
	case models.TNMTOMilestone:
		return MTOMilestoneTranslation()
	case models.TNMTOSolution:
		return MTOSolutionTranslation()
	case models.TNMTOMilestoneSolutionLink:
		return MTOMilestoneSolutionLinkTranslation()
	case models.TNMTOInfo:
		return MTOInfoTranslation()
	case models.TNMTOCommonSolutionContact:
		return MTOCommonSolutionContactTranslation()
	case models.TNMTOCommonSolutionContractor:
		return MTOCommonSolutionContractorTranslation()
	case models.TNPlanTimeline:
		return PlanTimelineTranslation()
	case models.TNMTOMilestoneNote:
		return MTOMilestoneNoteTranslation()
	case models.TNModelPlanMTOTemplateLink:
		return ModelPlanMTOTemplateLinkTranslation()

	default:

		return nil, fmt.Errorf("no translation for table: %s ", tableName)

	}

}

// MilestoneReasonTranslation holds the human-readable question label and translated answer
// for a single mto_suggested_milestone_reason row.
type MilestoneReasonTranslation struct {
	// Question is the human-readable question label for the triggering field,
	// e.g. "Will you manage Part C/D enrollment?".
	// Falls back to the raw column name when no translation is available.
	Question string
	// Answer is the human-readable answer for the triggering value,
	// e.g. "Yes" or "Yes, we expect to develop policies to manage the overlaps".
	// Falls back to the raw (or sanitized) value when no translation is available.
	Answer string
}

// TranslateMilestoneReason translates a raw (trigger_col, trigger_val) pair from
// mto_suggested_milestone_reason into human-readable question+answer strings using the
// existing field translation layer.
//
// It looks up the translation for the given trigger_table, finds the field by its db column name
// (trigger_col), sanitizes PostgreSQL boolean representations ("t"/"f" → "true"/"false"), then
// resolves the value through the field's options map.
// Falls back to the raw values if no translation is found at any step.
func TranslateMilestoneReason(table models.MilestoneSuggestionReasonTable, col, val string) MilestoneReasonTranslation {
	fallback := MilestoneReasonTranslation{Question: col, Answer: val}

	translation, err := GetTranslation(models.TableName(table))
	if err != nil {
		return fallback
	}

	translationMap, err := translation.ToMap()
	if err != nil {
		return fallback
	}

	field, ok := translationMap[col]
	if !ok {
		return fallback
	}

	question := field.GetLabel()

	// Sanitize PostgreSQL boolean representation before options lookup
	sanitized := val
	if field.GetDataType() == models.TDTBoolean {
		switch val {
		case "t":
			sanitized = "true"
		case "f":
			sanitized = "false"
		}
	}

	options, hasOptions := field.GetOptions()
	if !hasOptions {
		return MilestoneReasonTranslation{Question: question, Answer: sanitized}
	}

	translated, ok := options[sanitized]
	if !ok {
		return MilestoneReasonTranslation{Question: question, Answer: sanitized}
	}
	return MilestoneReasonTranslation{Question: question, Answer: fmt.Sprint(translated)}
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
