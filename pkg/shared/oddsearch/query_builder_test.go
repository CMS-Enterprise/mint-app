package oddsearch

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// MockFilterHandler is a mock implementation of the FilterHandler interface for testing.
type MockFilterHandler struct {
	HandleFilterFunc func(value interface{}) error
}

// HandleFilter is a mock implementation of the FilterHandler interface for testing.
func (m *MockFilterHandler) HandleFilter(value interface{}) error {
	return m.HandleFilterFunc(value)
}

// TestQueryBuilder_AddHandler tests the AddHandler method of the QueryBuilder.
func TestQueryBuilder_AddHandler(t *testing.T) {
	qb := NewQueryBuilder()

	handler := &MockFilterHandler{}
	err := qb.AddHandler("test", handler)

	assert.NoError(t, err, "AddHandler should not return an error when adding a new handler")
	assert.Equal(t, handler, qb.handlers["test"], "Handler should be added to the handlers map")
}

// TestQueryBuilder_AddHandler_AlreadyExists tests the AddHandler method of the QueryBuilder when a handler for the
// specified filter type already exists.
func TestQueryBuilder_AddHandler_AlreadyExists(t *testing.T) {
	qb := NewQueryBuilder()

	handler1 := &MockFilterHandler{}
	handler2 := &MockFilterHandler{}

	err := qb.AddHandler("test", handler1)
	assert.NoError(t, err, "AddHandler should not return an error when adding a new handler")

	err = qb.AddHandler("test", handler2)
	assert.Error(t, err, "AddHandler should return an error when adding a handler for a filter type that already exists")
}

// TestQueryBuilder_AddFilter tests the AddFilter method of the QueryBuilder.
func TestQueryBuilder_AddFilter(t *testing.T) {
	qb := NewQueryBuilder()

	handler := &MockFilterHandler{
		HandleFilterFunc: func(value interface{}) error {
			assert.Equal(t, "value", value, "Value passed to HandleFilter should match the input value")
			return nil
		},
	}
	err := qb.AddHandler("test", handler)
	assert.NoError(t, err, "AddHandler should not return an error when adding a new handler")

	err = qb.AddFilter("test", "value")
	assert.NoError(t, err, "AddFilter should not return an error when a valid handler is registered")
}

// TestQueryBuilder_AddFilter_UnsupportedFilterType tests the AddFilter method of the QueryBuilder when an unsupported
// filter type is used.
func TestQueryBuilder_AddFilter_UnsupportedFilterType(t *testing.T) {
	qb := NewQueryBuilder()

	err := qb.AddFilter("unsupported", "value")

	assert.Error(t, err, "AddFilter should return an error when an unsupported filter type is used")
}

// TestQueryBuilder_Build tests the Build method of the QueryBuilder.
func TestQueryBuilder_Build(t *testing.T) {
	qb := NewQueryBuilder()

	query := qb.Build()

	assert.NotNil(t, query, "Build should return a non-nil query")
}
