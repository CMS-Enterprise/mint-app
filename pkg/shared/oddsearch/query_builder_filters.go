package oddsearch

import (
	"github.com/aquasecurity/esquery"
)

// ChangedAfterFilter is a filter for the changed after filter
type ChangedAfterFilter struct {
	qb *QueryBuilder
}

// NewChangedAfterFilter creates a new ChangedAfterFilter
func NewChangedAfterFilter(qb *QueryBuilder) *ChangedAfterFilter {
	return &ChangedAfterFilter{qb: qb}
}

// HandleFilter handles the filter value for the ChangedAfterFilter
func (f *ChangedAfterFilter) HandleFilter(value interface{}) error {
	if f.qb.rangeQuery == nil {
		f.qb.rangeQuery = esquery.Range("modified_dts").Gte(value)
	} else {
		f.qb.rangeQuery = f.qb.rangeQuery.Gte(value)
	}
	return nil
}

// ChangedBeforeFilter is a filter for the changed before filter
type ChangedBeforeFilter struct {
	qb *QueryBuilder
}

// NewChangedBeforeFilter creates a new ChangedBeforeFilter
func NewChangedBeforeFilter(qb *QueryBuilder) *ChangedBeforeFilter {
	return &ChangedBeforeFilter{qb: qb}
}

// HandleFilter handles the filter value for the ChangedBeforeFilter
func (f *ChangedBeforeFilter) HandleFilter(value interface{}) error {
	if f.qb.rangeQuery == nil {
		f.qb.rangeQuery = esquery.Range("modified_dts").Lte(value)
	} else {
		f.qb.rangeQuery = f.qb.rangeQuery.Lte(value)
	}
	return nil
}

// ChangedByActorFilter is a filter for the changed by actor filter
type ChangedByActorFilter struct {
	qb *QueryBuilder
}

// NewChangedByActorFilter creates a new ChangedByActorFilter
func NewChangedByActorFilter(qb *QueryBuilder) *ChangedByActorFilter {
	return &ChangedByActorFilter{qb: qb}
}

// HandleFilter handles the filter value for the ChangedByActorFilter
func (f *ChangedByActorFilter) HandleFilter(value interface{}) error {
	f.qb.BoolQuery = f.qb.BoolQuery.Should(
		esquery.MultiMatch(value).Fields(
			"modified_by.common_name",
			"modified_by.username",
			"modified_by.given_name",
			"modified_by.family_name",
		).Fuzziness("AUTO").PrefixLength(1),
	)
	return nil
}

// ModelPlanIDFilter is a filter for the model plan ID filter
type ModelPlanIDFilter struct {
	qb *QueryBuilder
}

// NewModelPlanIDFilter creates a new ModelPlanIDFilter
func NewModelPlanIDFilter(qb *QueryBuilder) *ModelPlanIDFilter {
	return &ModelPlanIDFilter{qb: qb}
}

// HandleFilter handles the filter value for the ModelPlanIDFilter
func (f *ModelPlanIDFilter) HandleFilter(value interface{}) error {
	f.qb.BoolQuery = f.qb.BoolQuery.Filter(esquery.Term("model_plan_id.keyword", value))
	return nil
}

// ModelPlanStatusFilter is a filter for the model plan status filter
type ModelPlanStatusFilter struct {
	qb *QueryBuilder
}

// NewModelPlanStatusFilter creates a new ModelPlanStatusFilter
func NewModelPlanStatusFilter(qb *QueryBuilder) *ModelPlanStatusFilter {
	return &ModelPlanStatusFilter{qb: qb}
}

// HandleFilter handles the filter value for the ModelPlanStatusFilter
func (f *ModelPlanStatusFilter) HandleFilter(value interface{}) error {
	f.qb.BoolQuery = f.qb.BoolQuery.Should(
		esquery.Term("fields.status.new.keyword", value),
		esquery.Term("fields.status.old.keyword", value),
	).MinimumShouldMatch(1)
	return nil
}

// TableIDFilter is a filter for the table ID filter
type TableIDFilter struct {
	qb *QueryBuilder
}

// NewTableIDFilter creates a new TableIDFilter
func NewTableIDFilter(qb *QueryBuilder) *TableIDFilter {
	return &TableIDFilter{qb: qb}
}

// HandleFilter handles the filter value for the TableIDFilter
func (f *TableIDFilter) HandleFilter(value interface{}) error {
	f.qb.BoolQuery = f.qb.BoolQuery.Filter(esquery.Term("table_id", value))
	return nil
}

// TableNameFilter is a filter for the table name filter
type TableNameFilter struct {
	qb *QueryBuilder
}

// NewTableNameFilter creates a new TableNameFilter
func NewTableNameFilter(qb *QueryBuilder) *TableNameFilter {
	return &TableNameFilter{qb: qb}
}

// HandleFilter handles the filter value for the TableNameFilter
func (f *TableNameFilter) HandleFilter(value interface{}) error {
	f.qb.BoolQuery = f.qb.BoolQuery.Filter(esquery.Term("table_name.keyword", value))
	return nil
}

// FreeTextFilter is a filter for the free text filter
type FreeTextFilter struct {
	qb *QueryBuilder
}

// NewFreeTextFilter creates a new FreeTextFilter
func NewFreeTextFilter(qb *QueryBuilder) *FreeTextFilter {
	return &FreeTextFilter{qb: qb}
}

// HandleFilter handles the filter value for the FreeTextFilter
func (f *FreeTextFilter) HandleFilter(value interface{}) error {
	f.qb.BoolQuery = f.qb.BoolQuery.Must(
		esquery.MultiMatch(value).Fields("*").Fuzziness("AUTO").PrefixLength(1),
	)
	return nil
}
