package namedstatements

import (
	"errors"
	"sync"

	"github.com/jmoiron/sqlx"
)

// Cache is a cache of prepared statements.
type Cache struct {
	db                 *sqlx.DB
	preparedStatements sync.Map
}

// NewCache initializes a new Cache instance with the provided database.
func NewCache(db *sqlx.DB) *Cache {
	return &Cache{
		db:                 db,
		preparedStatements: sync.Map{},
	}
}

// Get returns a prepared statement for the provided query.
func (n *Cache) Get(query string) (*sqlx.NamedStmt, error) {
	if stmtInterface, ok := n.preparedStatements.Load(query); ok {
		stmt, ok := stmtInterface.(*sqlx.NamedStmt)
		if !ok {
			return nil, errors.New("failed to cast stmtInterface to *sqlx.Stmt")
		}

		return stmt, nil
	}

	return n.prepareNamed(query)
}

func (n *Cache) prepareNamed(query string) (*sqlx.NamedStmt, error) {
	stmt, err := n.db.PrepareNamed(query)
	if err != nil {
		return nil, err
	}

	n.preparedStatements.Store(query, stmt)
	return stmt, nil
}
