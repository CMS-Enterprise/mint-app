package storage

import (
	_ "embed"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/audit_change_collection_by_id_and_table.sql
var auditChangeCollectionByIDAndTable string

//go:embed SQL/audit_change_collection_by_id_and_table_and_field.sql
var auditChangeCollectionByIDAndTableAndField string

//go:embed SQL/audit_change_collection_by_foreign_key_and_table_and_field_and_date.sql
var auditChangeCollectionByForeignKeyAndTableAndDate string

//go:embed SQL/audit_change_collection_by_foreign_key_and_table_and_field_and_date.sql
var auditChangeCollectionByForeignKeyAndTableAndFieldAndDate string

//go:embed SQL/audit_change_collection_by_id_and_table_and_field_and_date.sql
var auditChangeCollectionByIDAndTableAndFieldAndDate string

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

// AuditChangeCollectionByIDAndTableAndField returns changes based on tablename and primary key from the database. It will only return record sets where the given field was modified. It will return all changed fields anywyas
func (s *Store) AuditChangeCollectionByIDAndTableAndField(logger *zap.Logger, tableName string, primaryKey uuid.UUID, fieldName string, sortDir models.SortDirection) ([]*models.AuditChange, error) {
	auditChanges := []*models.AuditChange{}
	orderedQuery := auditChangeCollectionByIDAndTableAndField
	orderClause := "" //default to ASCENDING
	if sortDir == models.SortDesc {
		orderClause = " ORDER BY 1 DESC"
	}

	orderedQuery = orderedQuery + orderClause

	stmt, err := s.db.PrepareNamed(orderedQuery)
	if err != nil {
		return nil, err

	}

	arg := map[string]interface{}{"primary_key": primaryKey,
		"table_name": tableName,
		"field_name": fieldName,
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil

}

// AuditChangeCollectionByIDAndTableAndField returns changes based on tablename and primary key from the database. It will only return record sets where the given field was modified. It will return all changed fields anywyas
func (s *Store) AuditChangeCollectionByIDAndTableAndFieldAndDate(logger *zap.Logger, tableName string, primaryKey uuid.UUID, fieldName string, date time.Time, sortDir models.SortDirection) ([]*models.AuditChange, error) {
	auditChanges := []*models.AuditChange{}
	orderedQuery := auditChangeCollectionByIDAndTableAndFieldAndDate
	orderClause := "" //default to ASCENDING
	if sortDir == models.SortDesc {
		orderClause = " ORDER BY 1 DESC"
	}

	orderedQuery = orderedQuery + orderClause

	stmt, err := s.db.PrepareNamed(orderedQuery)
	if err != nil {
		return nil, err

	}

	arg := map[string]interface{}{"primary_key": primaryKey,
		"table_name": tableName,
		"field_name": fieldName,
		"start_date": date.Format("2006-01-02"),
		"end_date":   date.AddDate(0, 0, 1).Format("2006-01-02"),
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil

}

func (s *Store) AuditChangeCollectionByForeignKeyAndTableAndDate(logger *zap.Logger, tableName string, foreignKey uuid.UUID, date time.Time, sortDir models.SortDirection) ([]*models.AuditChange, error) {
	auditChanges := []*models.AuditChange{}
	orderedQuery := auditChangeCollectionByForeignKeyAndTableAndDate
	orderClause := "" //default to ASCENDING
	if sortDir == models.SortDesc {
		orderClause = " ORDER BY 1 DESC"
	}

	orderedQuery = orderedQuery + orderClause

	stmt, err := s.db.PrepareNamed(orderedQuery)
	if err != nil {
		return nil, err

	}

	arg := map[string]interface{}{
		"foreign_key": foreignKey,
		"table_name":  tableName,
		"start_date":  date.Format("2006-01-02"),
		"end_date":    date.AddDate(0, 0, 1).Format("2006-01-02"),
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil

}

func (s *Store) AuditChangeCollectionByForeignKeyAndTableAndFieldAndDate(logger *zap.Logger, tableName string, foreignKey uuid.UUID, fieldName string, date time.Time, sortDir models.SortDirection) ([]*models.AuditChange, error) {
	auditChanges := []*models.AuditChange{}
	orderedQuery := auditChangeCollectionByForeignKeyAndTableAndFieldAndDate
	orderClause := "" //default to ASCENDING
	if sortDir == models.SortDesc {
		orderClause = " ORDER BY 1 DESC"
	}

	orderedQuery = orderedQuery + orderClause

	stmt, err := s.db.PrepareNamed(orderedQuery)
	if err != nil {
		return nil, err

	}

	arg := map[string]interface{}{
		"foreign_key": foreignKey,
		"table_name":  tableName,
		"field_name":  fieldName,
		"start_date":  date.Format("2006-01-02"),
		"end_date":    date.AddDate(0, 0, 1).Format("2006-01-02"),
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil

}
