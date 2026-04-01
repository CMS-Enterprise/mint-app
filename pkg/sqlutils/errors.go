package sqlutils

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/lib/pq"
)

/********************
* //Future Enhancement:
* Add more errors here when needed to handle specific errors later in the app code.
********************/

// ErrDuplicateConstraint is a pointer to the errDupConstraint error, which can be used to verify if an error is of this specific type.
var ErrDuplicateConstraint *errDupConstraint

// errDupConstraint is a custom error type for unique constraint violations that wraps the original pq error.
type errDupConstraint struct {
	baseDBError
}

// newErrDupConstraintErr is a constructor to be used when a pq error occurs because of a duplicate value error.
func newErrDupConstraintErr(message string, pqErr *pq.Error) *errDupConstraint {
	return &errDupConstraint{
		baseDBError: newBaseDBError(message, pqErr),
	}

}

// ErrNoRowsResult is used with errors.As(err, &sqlutils.ErrNoRowsResult) to detect zero-row results from
// sqlutils helpers (GetProcedure / ProcessDataBaseErrors). See also IsNoRowsResult.
var ErrNoRowsResult *errNoRowsResult

// errNoRowsResult wraps sql.ErrNoRows from stmt.Get / Scan paths that run through ProcessDataBaseErrors.
type errNoRowsResult struct {
	Message string
}

func newErrNoRowsResult(message string) *errNoRowsResult {
	return &errNoRowsResult{Message: message}
}

// Error implements error for errNoRowsResult.
func (e *errNoRowsResult) Error() string {
	return fmt.Sprintf("dbErr: no rows in result set: %s", e.Message)
}

// Unwrap returns sql.ErrNoRows so errors.Is(err, sql.ErrNoRows) continues to work on wrapped errors.
func (e *errNoRowsResult) Unwrap() error {
	return sql.ErrNoRows
}

// IsNoRowsResult reports whether err is sql.ErrNoRows, wraps it, or is a no-rows error from ProcessDataBaseErrors.
func IsNoRowsResult(err error) bool {
	if err == nil {
		return false
	}
	if errors.Is(err, sql.ErrNoRows) {
		return true
	}
	return errors.As(err, &ErrNoRowsResult)
}

// newBaseDBError is a constructor for the base db error.
func newBaseDBError(message string, pqErr *pq.Error) baseDBError {
	return baseDBError{
		Message:       message,
		OriginalError: pqErr,
	}

}

// baseDBError is the base type shared by all errors in the sqlutils package.
type baseDBError struct {
	Message       string
	OriginalError *pq.Error
}

// Error implements the error interface for ErrDuplicateConstraint.
func (e errDupConstraint) Error() string {
	return fmt.Sprintf("dbErr: duplicate key value violates unique constraint: %s, table: %s, detail: %s",
		e.OriginalError.Constraint, e.OriginalError.Table, e.OriginalError.Detail)
}

// Error implements the error interface for baseDBError. In most cases, this should be handled for each specific type that embeds it
func (e baseDBError) Error() string {
	return fmt.Sprintf("dbErr: message: %s, error %v", e.Message, e.OriginalError)
}

// Unwrap returns the original pq error.
func (e *baseDBError) Unwrap() error {
	return e.OriginalError
}

func ProcessDataBaseErrors(message string, err error) error {
	if pqErr, ok := err.(*pq.Error); ok {

		switch pqErr.Code.Name() {
		case "unique_violation":
			return newErrDupConstraintErr(message, pqErr)

		default:
			return newBaseDBError(message, pqErr)
		}

	}
	if errors.Is(err, sql.ErrNoRows) {
		return newErrNoRowsResult(message)
	}
	return fmt.Errorf(message+" err: %w", err)

}
