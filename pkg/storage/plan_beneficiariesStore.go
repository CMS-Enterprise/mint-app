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

// PlanBeneficiariesGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanBeneficiariesGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanBeneficiaries, error) {

	var benesSlice []*models.PlanBeneficiaries

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanBeneficiaries.GetByModelPlanIDLoader)
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

	b.ID = utilityuuid.ValueOrNewUUID(b.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanBeneficiaries.Create)
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanBeneficiaries.Update)
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

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanBeneficiaries.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&b, utilitysql.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &b, nil
}
