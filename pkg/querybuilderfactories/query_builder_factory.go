package querybuilderfactories

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/querybuilderfilters"
	"github.com/cmsgov/mint-app/pkg/shared/oddsearch"
)

// AddQueryBuilderFilterHandler adds a filter handler to the query builder for the given filter type
func AddQueryBuilderFilterHandler(
	qb *oddsearch.QueryBuilder,
	filterType model.SearchFilterType,
	handler oddsearch.FilterHandler,
) error {
	err := qb.AddHandler(string(filterType), handler)
	if err != nil {
		return err
	}

	return nil
}

// NewMINTQueryBuilder creates a new query builder for MINT
func NewMINTQueryBuilder() (*oddsearch.QueryBuilder, error) {
	qb := oddsearch.NewQueryBuilder()

	filters := []struct {
		filterType model.SearchFilterType
		handler    oddsearch.FilterHandler
	}{
		{model.SearchFilterTypeChangedAfter, oddsearch.NewChangedAfterFilter(qb)},
		{model.SearchFilterTypeChangedBefore, oddsearch.NewChangedBeforeFilter(qb)},
		{model.SearchFilterTypeChangedByActor, oddsearch.NewChangedByActorFilter(qb)},
		{model.SearchFilterTypeModelPlanID, oddsearch.NewModelPlanIDFilter(qb)},
		{model.SearchFilterTypeModelPlanStatus, oddsearch.NewModelPlanStatusFilter(qb)},
		{model.SearchFilterTypeTableID, oddsearch.NewTableIDFilter(qb)},
		{model.SearchFilterTypeTableName, oddsearch.NewTableNameFilter(qb)},
		{model.SearchFilterTypeFreeText, oddsearch.NewFreeTextFilter(qb)},
		{model.SearchFilterTypeModelPlanSection, querybuilderfilters.NewModelPlanSectionFilter(qb)},
	}

	for _, filter := range filters {
		err := AddQueryBuilderFilterHandler(qb, filter.filterType, filter.handler)
		if err != nil {
			return nil, err
		}
	}

	return qb, nil
}
