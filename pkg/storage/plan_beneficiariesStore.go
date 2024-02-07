package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
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
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanBeneficiaries, error) {

	var benesSlice []*models.PlanBeneficiaries

	stmt, err := s.db.PrepareNamed(planBeneficiariesGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&benesSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return benesSlice, nil
}

// PlanBeneficiariesCreate creates a new plan benficiaries object
func (s *Store) PlanBeneficiariesCreate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	b *models.PlanBeneficiaries,
) (*models.PlanBeneficiaries, error) {

	b.ID = utilityUUID.ValueOrNewUUID(b.ID)

	stmt, err := np.PrepareNamed(planBeneficiariesCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, b)
	}
	defer stmt.Close()

	b.ModifiedBy = nil
	b.ModifiedDts = nil
	err = stmt.Get(b, b)
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

	stmt, err := s.db.PrepareNamed(planBeneficiariesUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, b)
	}
	defer stmt.Close()

	err = stmt.Get(b, b)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, b)
	}

	return b, nil
}

// PlanBeneficiariesGetByID returns the plan general characteristics for a given id
func (s *Store) PlanBeneficiariesGetByID(
	_ *zap.Logger,
	id uuid.UUID,
) (*models.PlanBeneficiaries, error) {

	b := models.PlanBeneficiaries{}

	stmt, err := s.db.PrepareNamed(planBeneficiariesGetByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&b, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &b, nil
}
