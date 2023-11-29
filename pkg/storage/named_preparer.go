package storage

import "github.com/jmoiron/sqlx"

// NamedPreparer is an interface used by to exectute a sqlx transaction either directly or as a transacation.
type NamedPreparer interface {
	PrepareNamed(query string) (*sqlx.NamedStmt, error)
}
