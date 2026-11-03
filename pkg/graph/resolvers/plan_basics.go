package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// UpdatePlanBasics implements resolver logic to update a plan basics object
func UpdatePlanBasics(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanBasics, error) {
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.PlanBasics, error) {
		// Get existing basics
		existing, err := storage.PlanBasicsGetByID(tx, logger, id)
		if err != nil {
			return nil, err
		}

		err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, tx)
		if err != nil {
			return nil, err
		}

		retBasics, err := storage.PlanBasicsUpdate(tx, logger, existing)
		if err != nil {
			return nil, err
		}

		if err := BaseTaskListSectionAfterUpdate(
			ctx,
			tx,
			logger,
			existing.ModelPlanID,
			principal,
			nil,
			email.AddressBook{},
		); err != nil {
			return nil, err
		}

		return retBasics, nil
	})

}

// PlanBasicsGetByModelPlanIDLOADER implements resolver logic to get plan basics by a model plan ID using a data loader
func PlanBasicsGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanBasics, error) {
	return loaders.PlanBasics.ByModelPlanID.Load(ctx, modelPlanID)
}
