package oddsearch

import (
	"fmt"

	"github.com/aquasecurity/esquery"
)

// FilterHandler is an interface for handling a filter value
type FilterHandler interface {
	HandleFilter(value interface{}) error
}

// QueryBuilder is a builder for Elasticsearch queries
type QueryBuilder struct {
	query      *esquery.SearchRequest
	BoolQuery  *esquery.BoolQuery
	rangeQuery *esquery.RangeQuery
	handlers   map[string]FilterHandler
	sortBy     string
	order      esquery.Order
	offset     int
	limit      int
}

// NewQueryBuilder creates a new QueryBuilder
func NewQueryBuilder() *QueryBuilder {
	return &QueryBuilder{
		query:      esquery.Search(),
		BoolQuery:  esquery.Bool(),
		rangeQuery: nil,
		handlers:   make(map[string]FilterHandler),
		sortBy:     "",
		order:      esquery.OrderDesc,
		offset:     0,
		limit:      10,
	}
}

// AddHandler adds a handler for a filter type
func (qb *QueryBuilder) AddHandler(filterType string, handler FilterHandler) error {
	if _, exists := qb.handlers[filterType]; exists {
		return fmt.Errorf("handler for filter type %s already exists", filterType)
	}
	qb.handlers[filterType] = handler
	return nil
}

// AddFilter adds a filter to the query
func (qb *QueryBuilder) AddFilter(filterType string, filterValue interface{}) error {
	handler, ok := qb.handlers[filterType]
	if !ok {
		return fmt.Errorf("unsupported filter type: %s", filterType)
	}
	return handler.HandleFilter(filterValue)
}

// SortBy sets the sorting parameters for the query
func (qb *QueryBuilder) SortBy(field string, order esquery.Order) {
	qb.sortBy = field
	qb.order = order
}

// Page sets the pagination parameters for the query
func (qb *QueryBuilder) Page(offset int, limit int) {
	qb.offset = offset
	qb.limit = limit
}

// Build builds the query
func (qb *QueryBuilder) Build() *esquery.SearchRequest {
	if qb.rangeQuery != nil {
		qb.BoolQuery = qb.BoolQuery.Filter(qb.rangeQuery)
	}
	qb.query = qb.query.Query(qb.BoolQuery)

	// Apply sorting and pagination parameters
	if qb.sortBy != "" {
		qb.query = qb.query.Sort(qb.sortBy, qb.order)
	}
	if qb.offset > 0 {
		qb.query = qb.query.From(uint64(qb.offset))
	}
	if qb.limit > 0 {
		qb.query = qb.query.Size(uint64(qb.limit))
	}

	return qb.query
}
