package storage

import (
	_ "embed"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed SQL/analyzed_audit/create.sql
var analyzedAuditCreate string

//go:embed SQL/analyzed_audit/get_by_model_plan_id_and_date.sql
var analyzedAuditGetByModelPlanIDAndDate string

//go:embed SQL/analyzed_audit/get_collection_by_model_plan_ids_and_date.sql
var analyzedAuditGetByModelPlanIDsAndDate string

//go:embed SQL/analyzed_audit/get_by_date.sql
var analyzedAuditGetByDate string

// AnalyzedAuditCreate creates and returns an AnalyzedAudit object
func (s *Store) AnalyzedAuditCreate(logger *zap.Logger, AnalyzedAudit *models.AnalyzedAudit) (*models.AnalyzedAudit, error) {

	if AnalyzedAudit.ID == uuid.Nil {
		AnalyzedAudit.ID = uuid.New()
	}

	retAnalyzedAudit := models.AnalyzedAudit{}
	err := s.db.Get(&retAnalyzedAudit, analyzedAuditCreate, AnalyzedAudit)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to analyzed_audit with error %s", err),
			zap.String("user", AnalyzedAudit.CreatedBy.String()),
		)
		return nil, err

	}

	return &retAnalyzedAudit, nil
}

// AnalyzedAuditGetByModelPlanIDAndDate gets and returns all AnalyzedAudits by modelPlanID
func (s *Store) AnalyzedAuditGetByModelPlanIDAndDate(logger *zap.Logger, modelPlanID uuid.UUID, date time.Time) (*models.AnalyzedAudit, error) {

	analyzedAudit := models.AnalyzedAudit{}
	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"date":          date.Format("2006-01-02"),
	}

	err := s.db.Get(&analyzedAudit, analyzedAuditGetByModelPlanIDAndDate, arg)
	if err != nil {
		return nil, err
	}
	return &analyzedAudit, nil
}

// AnalyzedAuditGetByModelPlanIDsAndDate gets and returns all AnalyzedAudits by modelPlanIDs and date
func (s *Store) AnalyzedAuditGetByModelPlanIDsAndDate(logger *zap.Logger, modelPlanIDs []uuid.UUID, date time.Time) ([]*models.AnalyzedAudit, error) {

	var analyzedAudits []*models.AnalyzedAudit
	arg := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
		"date":           date.Format("2006-01-02"),
	}

	err := s.db.Select(&analyzedAudits, analyzedAuditGetByModelPlanIDsAndDate, arg)
	if err != nil {
		return nil, err
	}
	return analyzedAudits, nil
}

// AnalyzedAuditGetByDate gets and returns all AnalyzedAudits by date
func (s *Store) AnalyzedAuditGetByDate(_ *zap.Logger, date time.Time) ([]*models.AnalyzedAudit, error) {

	var analyzedAudits []*models.AnalyzedAudit
	arg := map[string]interface{}{
		"date": date.Format("2006-01-02"),
	}

	err := s.db.Select(&analyzedAudits, analyzedAuditGetByDate, arg)

	if err != nil {
		return nil, err
	}
	return analyzedAudits, nil
}
