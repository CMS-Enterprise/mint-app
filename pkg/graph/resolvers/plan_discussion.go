package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

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

// UpdatePlanDiscussion implements resolver logic to update a plan Discussion object
func UpdatePlanDiscussion(logger *zap.Logger, input *models.PlanDiscussion, principal *string, store *storage.Store) (*models.PlanDiscussion, error) {
	input.ModifiedBy = models.ValueOrEmpty(principal)

	//TODO do we need to do anything with status here?

	result, err := store.PlanDiscussionUpdate(logger, input)
	return result, err
}

// DeletePlanDiscussion implements resolver logic to Delete a plan Discussion object
func DeletePlanDiscussion(logger *zap.Logger, input *models.PlanDiscussion, principal *string, store *storage.Store) (*models.PlanDiscussion, error) {
	input.ModifiedBy = models.ValueOrEmpty(principal)

	result, err := store.PlanDiscussionDelete(logger, input)
	return result, err
}

// CreateDiscussionReply implements resolver logic to create a Discussion reply object
func CreateDiscussionReply(logger *zap.Logger, input *models.DiscussionReply, principal *string, store *storage.Store) (*models.DiscussionReply, error) {
	input.CreatedBy = models.ValueOrEmpty(principal)
	input.ModifiedBy = input.CreatedBy
	result, err := store.DiscussionReplyCreate(logger, input)
	return result, err
}

// UpdateDiscussionReply implements resolver logic to update a Discussion reply object
func UpdateDiscussionReply(logger *zap.Logger, input *models.DiscussionReply, principal *string, store *storage.Store) (*models.DiscussionReply, error) {

	input.ModifiedBy = models.ValueOrEmpty(principal)
	result, err := store.DiscussionReplyUpdate(logger, input)
	return result, err
}

// DeleteDiscussionReply implements resolver logic to Delete a Discussion reply object
func DeleteDiscussionReply(logger *zap.Logger, input *models.DiscussionReply, principal *string, store *storage.Store) (*models.DiscussionReply, error) {

	input.ModifiedBy = models.ValueOrEmpty(principal)
	result, err := store.DiscussionReplyDelete(logger, input)
	return result, err
}

//DiscussionReplyCollectionByDiscusionID returns all Discussion reply objects by a Discussion ID
func DiscussionReplyCollectionByDiscusionID(logger *zap.Logger, discussionID uuid.UUID, store *storage.Store) ([]*models.DiscussionReply, error) {

	result, err := store.DiscussionReplyCollectionByDiscusionID(logger, discussionID)
	return result, err

}

//PlanDiscussionCollectionByModelPlanID returns all plan discussion objects related to a model plan, as noted by it's ID
func PlanDiscussionCollectionByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanDiscussion, error) {

	result, err := store.PlanDiscussionCollectionByModelPlanID(logger, modelPlanID)
	return result, err
}
