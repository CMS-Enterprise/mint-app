package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_beneficiaries/create.sql
var planBeneficiariesCreateSQL string

//go:embed SQL/plan_beneficiaries/update.sql
var planBeneficiariesUpdateSQL string

//go:embed SQL/plan_beneficiaries/get_by_id.sql
var planBeneficiariesGetByIDSQL string

//go:embed SQL/plan_beneficiaries/get_by_model_plan_id_LOADER.sql
var planBeneficiariesGetByModelPlanIDLoaderSQL string

// PlanBeneficiariesGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanBeneficiariesGetByModelPlanIDLOADER(
	logger *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanBeneficiaries, error) {

	var benesSlice []*models.PlanBeneficiaries
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	// This returns more than one
	err := s.db.Select(&benesSlice, planBeneficiariesGetByModelPlanIDLoaderSQL, arg)
	if err != nil {
		return nil, err
	}

	return benesSlice, nil
}

// PlanBeneficiariesCreate creates a new plan benficiaries object
func (s *Store) PlanBeneficiariesCreate(
	logger *zap.Logger,
	b *models.PlanBeneficiaries,
) (*models.PlanBeneficiaries, error) {

	b.ID = utilityUUID.ValueOrNewUUID(b.ID)
	b.ModifiedBy = nil
	b.ModifiedDts = nil

	err := s.db.Get(b, planBeneficiariesCreateSQL, b)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, b)
	}

	return b, nil
}

// PlanBeneficiariesUpdate updates the plan general characteristics for a given id
func (s *Store) PlanBeneficiariesUpdate(
	logger *zap.Logger,
	b *models.PlanBeneficiaries,
) (*models.PlanBeneficiaries, error) {

	err := s.db.Get(b, planBeneficiariesUpdateSQL, b)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, b)
	}

	return b, nil
}

// PlanBeneficiariesGetByID returns the plan general characteristics for a given id
func (s *Store) PlanBeneficiariesGetByID(
	logger *zap.Logger,
	id uuid.UUID,
) (*models.PlanBeneficiaries, error) {

	b := models.PlanBeneficiaries{}

	err := s.db.Get(&b, planBeneficiariesGetByIDSQL, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &b, nil
}
