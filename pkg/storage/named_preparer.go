package storage

import "github.com/jmoiron/sqlx"

// INamedPreparer is an interface used by to exectute a sqlx transaction either directly or as a transacation.
type INamedPreparer interface {
	PrepareNamed(query string) (*sqlx.NamedStmt, error)
}
