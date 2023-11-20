package storage

import (
	"github.com/jmoiron/sqlx"
)

type Transaction struct {
	store      *Store // TODO: SW
	tx         *sqlx.Tx
	properties TransactionProperties
	results    map[string]interface{}
	errors     []error
}
type TransactionProperties struct {
	commited   bool
	rolledBack bool
}

func NewTransaction(store *Store) *Transaction {
	return &Transaction{
		store:      store,
		tx:         store.db.MustBegin(),
		results:    map[string]interface{}{},
		properties: TransactionProperties{},
		errors:     []error{},
	}

}

func (t *Transaction) GetResult(resultKey string) (interface{}, error) {

	return t.results[resultKey], nil // TODO: SW make this error if result isn't present
}

func (t *Transaction) SetResult(resultKey string, result interface{}) {
	t.results[resultKey] = result
}

// Next takes a function
func (t *Transaction) Next(tFunc func(t *Transaction) error) *Transaction {
	err := tFunc(t)
	if err != nil {
		t.errors = append(t.errors, err)
	}
	// TODO: SW take a chain functon and define how the results get stored in the interface

	return t

}

// Commit will attempt to commit a transaction.
// If there is an error, it will attempt to rollback the tx
// Any errors encountered during the attempts will be appeneded to the errors list
func (t *Transaction) Commit() *Transaction {
	err := t.tx.Commit()
	if err != nil {
		t.errors = append(t.errors, err)
		rollbackErr := t.tx.Rollback()
		if rollbackErr != nil {
			t.errors = append(t.errors, rollbackErr)
			return t
		}
		t.properties.rolledBack = true
		return t
	}
	t.properties.commited = true

	return t
}
