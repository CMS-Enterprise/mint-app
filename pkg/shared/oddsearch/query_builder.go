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
	boolQuery  *esquery.BoolQuery
	rangeQuery *esquery.RangeQuery
	handlers   map[string]FilterHandler
}

// NewQueryBuilder creates a new QueryBuilder
func NewQueryBuilder() *QueryBuilder {
	return &QueryBuilder{
		query:      esquery.Search(),
		boolQuery:  esquery.Bool(),
		rangeQuery: nil,
		handlers:   make(map[string]FilterHandler),
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

// Build builds the query
func (qb *QueryBuilder) Build() *esquery.SearchRequest {
	if qb.rangeQuery != nil {
		qb.boolQuery = qb.boolQuery.Filter(qb.rangeQuery)
	}
	qb.query = qb.query.Query(qb.boolQuery)
	return qb.query
}
