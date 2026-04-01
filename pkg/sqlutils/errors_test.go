package sqlutils

import (
	"database/sql"
	"errors"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestProcessDataBaseErrors_NoRows(t *testing.T) {
	t.Parallel()

	wrapped := ProcessDataBaseErrors("issue executing named statement", sql.ErrNoRows)
	require.Error(t, wrapped)

	assert.True(t, errors.Is(wrapped, sql.ErrNoRows))
	assert.True(t, IsNoRowsResult(wrapped))

	var got *errNoRowsResult
	require.True(t, errors.As(wrapped, &got))
	assert.Contains(t, wrapped.Error(), "issue executing named statement")
	assert.Contains(t, wrapped.Error(), "no rows in result set")
}

func TestIsNoRowsResult_RawDriverError(t *testing.T) {
	t.Parallel()

	assert.True(t, IsNoRowsResult(sql.ErrNoRows))
	assert.False(t, IsNoRowsResult(nil))
	assert.False(t, IsNoRowsResult(errors.New("other")))
}

func TestIsNoRowsResult_WrappedChain(t *testing.T) {
	t.Parallel()

	inner := ProcessDataBaseErrors("issue executing named statement", sql.ErrNoRows)
	outer := fmt.Errorf("outer: %w", inner)

	assert.True(t, errors.Is(outer, sql.ErrNoRows))
	assert.True(t, IsNoRowsResult(outer))
}
