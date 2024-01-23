package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/plan_cr/create.sql
var planCRCreateSQL string

//go:embed SQL/plan_cr/update.sql
var planCRUpdateSQL string

//go:embed SQL/plan_cr/delete.sql
var planCRDeleteSQL string

//go:embed SQL/plan_cr/get.sql
var planCRGetSQL string

//go:embed SQL/plan_cr/collection_by_model_plan_id.sql
var planCRCollectionByModelPlanIDSQL string

// PlanCRCreate creates  returns a plan_cr_tdl object
func (s *Store) PlanCRCreate(logger *zap.Logger, planCR *models.PlanCR) (*models.PlanCR, error) {
	if planCR.ID == uuid.Nil {
		planCR.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(planCRCreateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create CR with error %s", err),
			zap.String("user", planCR.CreatedBy.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	retCR := models.PlanCR{}
	err = stmt.Get(&retCR, planCR)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create CR with error %s", err),
			zap.String("user", planCR.CreatedBy.String()),
		)
		return nil, err
	}

	return &retCR, nil
}

// PlanCRUpdate updates and returns a plan_cr_tdl object
func (s *Store) PlanCRUpdate(logger *zap.Logger, planCR *models.PlanCR) (*models.PlanCR, error) {
	stmt, err := s.db.PrepareNamed(planCRUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, planCR)
	}
	defer stmt.Close()

	err = stmt.Get(planCR, planCR)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, planCR)
	}

	return planCR, nil
}

// PlanCRDelete deletes a plan_cr_tdl
func (s *Store) PlanCRDelete(_ *zap.Logger, id uuid.UUID, userID uuid.UUID) (*models.PlanCR, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(planCRDeleteSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	deletedCR := models.PlanCR{}
	err = stmt.Get(&deletedCR, arg)
	if err != nil {
		return nil, err
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit cr tdl delete transaction: %w", err)
	}

	return &deletedCR, nil
}

// PlanCRGetByID returns a plan_cr_tdl
func (s *Store) PlanCRGetByID(_ *zap.Logger, id uuid.UUID) (*models.PlanCR, error) {

	stmt, err := s.db.PrepareNamed(planCRGetSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	retCR := models.PlanCR{}
	err = stmt.Get(&retCR, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return &retCR, nil
}

// PlanCRsGetByModelPlanID returns all plan_cr_tdls associated with a model plan
func (s *Store) PlanCRsGetByModelPlanID(_ *zap.Logger, modelPlanID uuid.UUID) ([]*models.PlanCR, error) {

	var planCRs []*models.PlanCR

	stmt, err := s.db.PrepareNamed(planCRCollectionByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = stmt.Select(&planCRs, arg)

	if err != nil {
		return nil, err
	}
	return planCRs, nil
}
