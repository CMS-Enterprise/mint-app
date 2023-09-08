package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/plan_cr_tdl/create.sql
var planCrTdlCreateSQL string

//go:embed SQL/plan_cr_tdl/update.sql
var planCrTdlUpdateSQL string

//go:embed SQL/plan_cr_tdl/delete.sql
var planCrTdlDeleteSQL string

//go:embed SQL/plan_cr_tdl/get.sql
var planCrTdlGetSQL string

//go:embed SQL/plan_cr_tdl/collection_by_model_plan_id.sql
var planCrTdlCollectionByModelPlanIDSQL string

// PlanCrTdlCreate creates  returns a plan_cr_tdl object
func (s *Store) PlanCrTdlCreate(logger *zap.Logger, planCrTdl *models.PlanCrTdl) (*models.PlanCrTdl, error) {

	if planCrTdl.ID == uuid.Nil {
		planCrTdl.ID = uuid.New()
	}

	retCrTdl := models.PlanCrTdl{}
	err := s.db.Get(&retCrTdl, planCrTdlCreateSQL, planCrTdl)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to cr__tdl with error %s", err),
			zap.String("user", planCrTdl.CreatedBy.String()),
		)
		return nil, err

	}

	return &retCrTdl, nil
}

// PlanCrTdlUpdate updates and returns a plan_cr_tdl object
func (s *Store) PlanCrTdlUpdate(logger *zap.Logger, planCrTdl *models.PlanCrTdl) (*models.PlanCrTdl, error) {

	err := s.db.Get(planCrTdl, planCrTdlUpdateSQL, planCrTdl)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, planCrTdl)
	}

	return planCrTdl, nil
}

// PlanCrTdlDelete deletes a plan_cr_tdl
func (s *Store) PlanCrTdlDelete(logger *zap.Logger, id uuid.UUID, userID uuid.UUID) (*models.PlanCrTdl, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()
	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(planCrTdlDeleteSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"id": id,
	}
	deleteCrTdl := models.PlanCrTdl{}
	err = stmt.Get(&deleteCrTdl, arg)
	if err != nil {
		return nil, err
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit cr tdl delete transaction: %w", err)
	}

	return &deleteCrTdl, nil
}

// PlanCrTdlGetByID returns a plan_cr_tdl
func (s *Store) PlanCrTdlGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanCrTdl, error) {

	arg := map[string]interface{}{
		"id": id,
	}
	retCrTdl := models.PlanCrTdl{}

	err := s.db.Get(&retCrTdl, planCrTdlGetSQL, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return &retCrTdl, nil
}

// PlanCrTdlsGetByModelPlanID returns all plan_cr_tdls associated with a model plan
func (s *Store) PlanCrTdlsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.PlanCrTdl, error) {

	var planCrTdls []*models.PlanCrTdl
	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err := s.db.Select(&planCrTdls, planCrTdlCollectionByModelPlanIDSQL, arg)

	if err != nil {
		return nil, err
	}
	return planCrTdls, nil
}
