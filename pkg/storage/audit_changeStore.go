package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/audit_change_collection_by_id_and_table.sql
var auditChangeCollectionByIDAndTable string

// AuditChangeCollectionByIDAndTable returns changes based on tablename and primary key from the database
func (s *Store) AuditChangeCollectionByIDAndTable(logger *zap.Logger, tableName string, primaryKey uuid.UUID) ([]*models.AuditChange, error) {
	auditChanges := []*models.AuditChange{}

	stmt, err := s.db.PrepareNamed(auditChangeCollectionByIDAndTable)
	if err != nil {
		return nil, err

	}
	//Add support for secondary key perhaps
	arg := map[string]interface{}{"primary_key": primaryKey,
		"table_name": tableName,
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil

}
