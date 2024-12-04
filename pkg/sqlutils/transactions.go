// Package sqlutils contains functionality to wrap existing database functionality
package sqlutils

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// TransactionFunc defines the function signature needed to represent passing a transaction and returning a generic type
type TransactionFunc[T any] func(*sqlx.Tx) (*T, error)

// WithTransaction is a wrapper function which handles creating, committing or rolling back a transaction
// If there are any errors when executing the txFunc, the tx is rolled back. Otherwise, the tx is committed.
func WithTransaction[T any](txPrep TransactionPreparer, txFunc TransactionFunc[T]) (*T, error) {
	tx, err := txPrep.Beginx()
	if err != nil {
		return nil, fmt.Errorf("error creating transaction %w", err)
	}

	result, errFunc := txFunc(tx)
	if errFunc != nil {
		rollbackErr := tx.Rollback()
		if rollbackErr != nil {
			return nil, fmt.Errorf("issue rolling back transaction: %w", rollbackErr)
		}
		return nil, errFunc

	}

	err = tx.Commit()

	if err != nil {
		return nil, fmt.Errorf("issue committing transaction: %w", err)
	}

	return result, nil
}

// WithTransactionNoReturn is used for transactions that are execution only (i.e., no return value) and only returns an error
func WithTransactionNoReturn(txPrep TransactionPreparer, txFunc func(*sqlx.Tx) error) error {
	_, err := WithTransaction[any](txPrep, func(tx *sqlx.Tx) (*any, error) {
		return nil, txFunc(tx)
	})

	return err
}
