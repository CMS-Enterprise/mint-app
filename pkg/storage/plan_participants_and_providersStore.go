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

//go:embed SQL/plan_participants_and_providers/create.sql
var planParticipantsAndProvidersCreateSQL string

//go:embed SQL/plan_participants_and_providers/update.sql
var planParticipantsAndProvidersUpdateSQL string

//go:embed SQL/plan_participants_and_providers/get_by_id.sql
var planParticipantsAndProvidersGetByIDSQL string

//go:embed SQL/plan_participants_and_providers/get_by_model_plan_id_LOADER.sql
var planParticipantsAndProvidersGetByModelPlanIDLoaderSQL string

// PlanParticipantsAndProvidersGetByModelPlanIDLOADER returns the plan
// GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanParticipantsAndProvidersGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanParticipantsAndProviders, error) {

	var pAndPSlice []*models.PlanParticipantsAndProviders

	stmt, err := s.db.PrepareNamed(planParticipantsAndProvidersGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&pAndPSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return pAndPSlice, nil
}

// PlanParticipantsAndProvidersCreate creates a new plan providers_and_participants object
func (s *Store) PlanParticipantsAndProvidersCreate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	gc *models.PlanParticipantsAndProviders,
) (*models.PlanParticipantsAndProviders, error) {

	gc.ID = utilityUUID.ValueOrNewUUID(gc.ID)

	stmt, err := np.PrepareNamed(planParticipantsAndProvidersCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}
	defer stmt.Close()

	gc.ModifiedBy = nil
	gc.ModifiedDts = nil

	err = stmt.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	return gc, nil
}

// PlanParticipantsAndProvidersUpdate updates the plan providers_and_participants for a given id
func (s *Store) PlanParticipantsAndProvidersUpdate(
	logger *zap.Logger,
	gc *models.PlanParticipantsAndProviders,
) (*models.PlanParticipantsAndProviders, error) {

	stmt, err := s.db.PrepareNamed(planParticipantsAndProvidersUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, gc)
	}
	defer stmt.Close()

	ret := models.PlanParticipantsAndProviders{}

	err = stmt.Get(&ret, gc)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, gc)
	}

	return &ret, nil
}

// PlanParticipantsAndProvidersGetByID returns the plan providers_and_participants for a given id
func (s *Store) PlanParticipantsAndProvidersGetByID(
	_ *zap.Logger,
	id uuid.UUID,
) (*models.PlanParticipantsAndProviders, error) {

	gc := models.PlanParticipantsAndProviders{}

	stmt, err := s.db.PrepareNamed(planParticipantsAndProvidersGetByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&gc, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &gc, nil
}
