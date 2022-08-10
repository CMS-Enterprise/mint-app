package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// PlanPaymentsCreate handles requests to create a Plan Payment
func PlanPaymentsCreate(
	logger *zap.Logger,
	store *storage.Store,
	payments *models.PlanPayments,
) (*models.PlanPayments, error) {

	return store.PlanPaymentsCreate(logger, payments)
}

// PlanPaymentsRead handles requests to find a Plan Payment by ID
func PlanPaymentsRead(
	logger *zap.Logger,
	store *storage.Store,
	id uuid.UUID,
) (*models.PlanPayments, error) {

	return store.PlanPaymentsRead(logger, id)
}

// PlanPaymentsReadByModelPlan handles requests to find a Plan Payment by model plan association
func PlanPaymentsReadByModelPlan(
	logger *zap.Logger,
	store *storage.Store,
	id uuid.UUID,
) (*models.PlanPayments, error) {

	return store.PlanPaymentsReadByModelPlan(logger, id)
}

// PlanPaymentsUpdate handles requests to update a Plan Payment
func PlanPaymentsUpdate(
	logger *zap.Logger,
	store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
) (*models.PlanPayments, error) {

	payments, err := store.PlanPaymentsRead(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(payments, changes, principal)
	if err != nil {
		return nil, err
	}
	return store.PlanPaymentsUpdate(logger, payments)
}
