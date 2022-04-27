package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanDiscussion implements resolver logic to create a plan Discussion object
func CreatePlanDiscussion(logger *zap.Logger, input *models.PlanDiscussion, principal *string, store *storage.Store) (*models.PlanDiscussion, error) {
	input.CreatedBy = models.ValueOrEmpty(principal)
	input.ModifiedBy = input.CreatedBy
	input.Status = models.DiscussionUnAnswered

	result, err := store.PlanDiscussionCreate(logger, input)
	return result, err
}
