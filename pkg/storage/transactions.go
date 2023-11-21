package storage

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

type TransactionFunc[T any] func(*sqlx.Tx) (*T, error)

func WithTransaction[T any](s *Store, txFunc TransactionFunc[T]) (*T, error) {
	tx, err := s.db.Beginx()
	if err != nil {
		return nil, err
	}

	result, err := txFunc(tx)
	if err != nil {
		rollbackErr := tx.Rollback()
		if rollbackErr != nil {
			return nil, fmt.Errorf("error rolling back transaction: %w", rollbackErr)
		}
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return result, nil
}
