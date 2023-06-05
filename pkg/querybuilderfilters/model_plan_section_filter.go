package querybuilderfilters

import (
	"fmt"

	"github.com/aquasecurity/esquery"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/shared/oddsearch"
)

// ModelPlanSectionFilter is a filter for the model plan section filter
type ModelPlanSectionFilter struct {
	qb                *oddsearch.QueryBuilder
	sectionTableIDMap map[model.SearchableTaskListSection]int
}

// NewModelPlanSectionFilter creates a new ModelPlanSectionFilter
func NewModelPlanSectionFilter(qb *oddsearch.QueryBuilder) *ModelPlanSectionFilter {
	return &ModelPlanSectionFilter{
		qb: qb,
		sectionTableIDMap: map[model.SearchableTaskListSection]int{
			model.SearchableTaskListSectionBasics:                          2,
			model.SearchableTaskListSectionGeneralCharacteristics:          8,
			model.SearchableTaskListSectionParticipantsAndProviders:        11,
			model.SearchableTaskListSectionBeneficiaries:                   3,
			model.SearchableTaskListSectionOperationsEvaluationAndLearning: 10,
			model.SearchableTaskListSectionPayment:                         12,
		},
	}
}

// HandleFilter handles the filter value for the ModelPlanSectionFilter
func (f *ModelPlanSectionFilter) HandleFilter(value interface{}) error {
	sectionQuery := esquery.Bool()

	switch v := value.(type) {
	case []interface{}:
		for _, val := range v {
			section := model.SearchableTaskListSection("")
			if err := section.UnmarshalGQL(val); err != nil {
				return err
			}
			if err := f.addSectionToQuery(section, sectionQuery); err != nil {
				return err
			}
		}
	case interface{}:
		section := model.SearchableTaskListSection("")
		if err := section.UnmarshalGQL(v); err != nil {
			return err
		}
		if err := f.addSectionToQuery(section, sectionQuery); err != nil {
			return err
		}
	default:
		return fmt.Errorf("invalid section value: %v", value)
	}

	f.qb.BoolQuery = f.qb.BoolQuery.Filter(sectionQuery)

	return nil
}

// addSectionToQuery adds a section to the provided query
func (f *ModelPlanSectionFilter) addSectionToQuery(section model.SearchableTaskListSection, query *esquery.BoolQuery) error {
	tableID, ok := f.sectionTableIDMap[section]
	if !ok {
		return fmt.Errorf("cannot find table ID associated with section value: %v", section)
	}

	// Add a TermQuery for the section to the BoolQuery
	query.Should(esquery.Term("table_id", tableID))

	return nil
}
