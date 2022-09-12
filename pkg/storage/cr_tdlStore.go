package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/cr_tdl_create.sql
var crTdlCreateSQL string

//go:embed SQL/cr_tdl_update.sql
var crTdlUpdateSQL string

//go:embed SQL/cr_tdl_delete.sql
var crTdlDeleteSQL string

//go:embed SQL/cr_tdl_get.sql
var crTdlGetSQL string

//go:embed SQL/cr_tdl_collection_by_model_plan_id.sql
var crTdlCollectionByModelPlanIDSQL string

// CrTdlCreate creates  returns a cr_tdl object
func (s *Store) CrTdlCreate(logger *zap.Logger, crTdl models.CrTdl) (*models.CrTdl, error) {

	if crTdl.ID == uuid.Nil {
		crTdl.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(crTdlCreateSQL)

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create cr__tdl with error %s", err),
			zap.String("user", crTdl.CreatedBy),
		)
		return nil, err
	}
	retCrTdl := models.CrTdl{}
	err = stmt.Get(&retCrTdl, crTdl)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to cr__tdl with error %s", err),
			zap.String("user", crTdl.CreatedBy),
		)
		return nil, err

	}

	return &retCrTdl, nil
}

// CrTdlUpdate updates and returns a cr_tdl object
func (s *Store) CrTdlUpdate(logger *zap.Logger, crTdl *models.CrTdl) (*models.CrTdl, error) {

	statement, err := s.db.PrepareNamed(crTdlUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, crTdl)
	}

	err = statement.Get(crTdl, crTdl)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, crTdl)
	}

	return crTdl, nil
}

// CrTdlDelete deletes a cr_tdl
func (s *Store) CrTdlDelete(logger *zap.Logger, id uuid.UUID) (*models.CrTdl, error) {
	stmt, err := s.db.PrepareNamed(crTdlDeleteSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"id": id,
	}
	deleteCrTdl := models.CrTdl{}
	err = stmt.Get(&deleteCrTdl, arg)
	if err != nil {
		return nil, err
	}

	return &deleteCrTdl, nil
}

// CrTdlGetByID returns a cr_tdl
func (s *Store) CrTdlGetByID(logger *zap.Logger, id uuid.UUID) (*models.CrTdl, error) {
	stmt, err := s.db.PrepareNamed(crTdlGetSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"id": id,
	}
	retCrTdl := models.CrTdl{}
	err = stmt.Get(&retCrTdl, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return &retCrTdl, nil
}

// CrTdlsGetByModelPlanID returns all cr_tdls associated with a model plan
func (s *Store) CrTdlsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.CrTdl, error) {
	crTdls := []*models.CrTdl{}

	stmt, err := s.db.PrepareNamed(crTdlCollectionByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = stmt.Select(&crTdls, arg)

	if err != nil {
		return nil, err
	}
	return crTdls, nil
}
