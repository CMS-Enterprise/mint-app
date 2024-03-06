package storage

import (
	_ "embed"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// AnalyzedAuditCreate creates and returns an AnalyzedAudit object
func (s *Store) AnalyzedAuditCreate(
	logger *zap.Logger,
	AnalyzedAudit *models.AnalyzedAudit,
) (*models.AnalyzedAudit, error) {

	if AnalyzedAudit.ID == uuid.Nil {
		AnalyzedAudit.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(sqlqueries.AnalyzedAudit.Create)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create analyzed_audit with error %s", err),
			zap.String("user", AnalyzedAudit.CreatedBy.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	retAnalyzedAudit := models.AnalyzedAudit{}

	err = stmt.Get(&retAnalyzedAudit, AnalyzedAudit)
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
func (s *Store) AnalyzedAuditGetByModelPlanIDAndDate(
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	date time.Time,
) (*models.AnalyzedAudit, error) {

	analyzedAudit := models.AnalyzedAudit{}

	stmt, err := s.db.PrepareNamed(sqlqueries.AnalyzedAudit.GetByModelPlanIDAndDate)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"date":          date.Format("2006-01-02"),
	}

	err = stmt.Get(&analyzedAudit, arg)

	if err != nil {
		return nil, err
	}
	return &analyzedAudit, nil
}

// AnalyzedAuditGetByModelPlanIDsAndDate gets and returns all AnalyzedAudits by modelPlanIDs and date
func AnalyzedAuditGetByModelPlanIDsAndDate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanIDs []uuid.UUID,
	date time.Time,
) ([]*models.AnalyzedAudit, error) {

	var analyzedAudits []*models.AnalyzedAudit

	stmt, err := np.PrepareNamed(sqlqueries.AnalyzedAudit.CollectionGetByModelPlanIDsAndDate)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
		"date":           date.Format("2006-01-02"),
	}

	err = stmt.Select(&analyzedAudits, arg)

	if err != nil {
		return nil, err
	}
	return analyzedAudits, nil
}

// AnalyzedAuditGetByDate gets and returns all AnalyzedAudits by date
func (s *Store) AnalyzedAuditGetByDate(_ *zap.Logger, date time.Time) ([]*models.AnalyzedAudit, error) {

	var analyzedAudits []*models.AnalyzedAudit

	stmt, err := s.db.PrepareNamed(sqlqueries.AnalyzedAudit.GetByDate)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"date": date.Format("2006-01-02"),
	}

	err = stmt.Select(&analyzedAudits, arg)

	if err != nil {
		return nil, err
	}
	return analyzedAudits, nil
}

// AnalyzedAuditGetByModelPlanIDsAndDateLoader gets and returns all AnalyzedAudits by modelPlanIDs and date using a dataLoader
func AnalyzedAuditGetByModelPlanIDsAndDateLoader(
	np sqlutils.NamedPreparer,
	paramTableJSON string,
) ([]*models.AnalyzedAudit, error) {

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	retAnalyzedAudits, err := sqlutils.SelectProcedure[models.AnalyzedAudit](np, sqlqueries.AnalyzedAudit.CollectionGetByModelPlanIDsAndDateLoader, arg)
	if err != nil {
		return nil, fmt.Errorf("issue selecting analyzed audits by date and model plan ids with the data loader, %w", err)
	}

	return retAnalyzedAudits, nil
}
