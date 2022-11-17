package storage

import (
	_ "embed"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/analyzed_audit_create.sql
var analyzedAuditCreate string

//go:embed SQL/analyzed_audit_delete.sql
var analyzedAuditDelete string

//go:embed SQL/analyzed_audit_get_by_model_plan_id.sql
var analyzedAuditGetByModelPlanID string

// AnalyzedAuditCreate creates and returns an AnalyzedAudit object
func (s *Store) AnalyzedAuditCreate(logger *zap.Logger, AnalyzedAudit *models.AnalyzedAudit) (*models.AnalyzedAudit, error) {

	if AnalyzedAudit.ID == uuid.Nil {
		AnalyzedAudit.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(analyzedAuditCreate)

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create cr__tdl with error %s", err),
			zap.String("user", AnalyzedAudit.CreatedBy),
		)
		return nil, err
	}
	retAnalyzedAudit := models.AnalyzedAudit{}
	err = stmt.Get(&retAnalyzedAudit, AnalyzedAudit)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to cr__tdl with error %s", err),
			zap.String("user", AnalyzedAudit.CreatedBy),
		)
		return nil, err

	}

	return &retAnalyzedAudit, nil
}

// AnalyzedAuditDelete deletes an AnalyzedAudit by ID
func (s *Store) AnalyzedAuditDelete(logger *zap.Logger, id uuid.UUID) (*models.AnalyzedAudit, error) {
	stmt, err := s.db.PrepareNamed(analyzedAuditDelete)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"id": id,
	}
	deletedAnalyzedAudit := models.AnalyzedAudit{}
	err = stmt.Get(&deletedAnalyzedAudit, arg)
	if err != nil {
		return nil, err
	}

	return &deletedAnalyzedAudit, nil
}

// AnalyzedAuditGetByModelPlanID gets and returns all AnalyzedAudits by modelPlanID
func (s *Store) AnalyzedAuditGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.AnalyzedAudit, error) {
	analyzedAudits := []*models.AnalyzedAudit{}

	stmt, err := s.db.PrepareNamed(analyzedAuditGetByModelPlanID)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = stmt.Select(&analyzedAudits, arg)

	if err != nil {
		return nil, err
	}
	return analyzedAudits, nil
}
