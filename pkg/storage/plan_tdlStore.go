package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/plan_tdl/create.sql
var planTDLCreateSQL string

//go:embed SQL/plan_tdl/update.sql
var planTDLUpdateSQL string

//go:embed SQL/plan_tdl/delete.sql
var planTDLDeleteSQL string

//go:embed SQL/plan_tdl/get.sql
var planTDLGetSQL string

//go:embed SQL/plan_tdl/collection_by_model_plan_id.sql
var planTDLCollectionByModelPlanIDSQL string

// PlanTDLCreate creates  returns a plan_cr_tdl object
func (s *Store) PlanTDLCreate(logger *zap.Logger, planTDL *models.PlanTDL) (*models.PlanTDL, error) {
	if planTDL.ID == uuid.Nil {
		planTDL.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(planTDLCreateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create TDL with error %s", err),
			zap.String("user", planTDL.CreatedBy.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	retTDL := models.PlanTDL{}
	err = stmt.Get(&retTDL, planTDL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create TDL with error %s", err),
			zap.String("user", planTDL.CreatedBy.String()),
		)
		return nil, err
	}

	return &retTDL, nil
}

// PlanTDLUpdate updates and returns a plan_cr_tdl object
func (s *Store) PlanTDLUpdate(logger *zap.Logger, planTDL *models.PlanTDL) (*models.PlanTDL, error) {
	stmt, err := s.db.PrepareNamed(planTDLUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, planTDL)
	}
	defer stmt.Close()

	err = stmt.Get(planTDL, planTDL)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, planTDL)
	}

	return planTDL, nil
}

// PlanTDLDelete deletes a plan_cr_tdl
func (s *Store) PlanTDLDelete(_ *zap.Logger, id uuid.UUID, userID uuid.UUID) (*models.PlanTDL, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(planTDLDeleteSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	deletedTDL := models.PlanTDL{}
	err = stmt.Get(&deletedTDL, arg)
	if err != nil {
		return nil, err
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit cr tdl delete transaction: %w", err)
	}

	return &deletedTDL, nil
}

// PlanTDLGetByID returns a plan_cr_tdl
func (s *Store) PlanTDLGetByID(_ *zap.Logger, id uuid.UUID) (*models.PlanTDL, error) {

	stmt, err := s.db.PrepareNamed(planTDLGetSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	retTDL := models.PlanTDL{}
	err = stmt.Get(&retTDL, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return &retTDL, nil
}

// PlanTDLsGetByModelPlanID returns all plan_cr_tdls associated with a model plan
func (s *Store) PlanTDLsGetByModelPlanID(_ *zap.Logger, modelPlanID uuid.UUID) ([]*models.PlanTDL, error) {

	var planTDLs []*models.PlanTDL

	stmt, err := s.db.PrepareNamed(planTDLCollectionByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = stmt.Select(&planTDLs, arg)

	if err != nil {
		return nil, err
	}
	return planTDLs, nil
}
