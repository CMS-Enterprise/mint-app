package storage

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
)

// PlanParticipantsAndProvidersGetByModelPlanIDLOADER returns the plan
// GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanParticipantsAndProvidersGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanParticipantsAndProviders, error) {

	var pAndPSlice []*models.PlanParticipantsAndProviders

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanParticipantsAndProviders.GetByModelPlanIDLoader)
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

	gc.ID = utilityuuid.ValueOrNewUUID(gc.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanParticipantsAndProviders.Create)
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanParticipantsAndProviders.Update)
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanParticipantsAndProviders.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&gc, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &gc, nil
}
