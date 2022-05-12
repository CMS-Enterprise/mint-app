package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanDiscussion implements resolver logic to create a plan Discussion object
func CreatePlanDiscussion(logger *zap.Logger, input *model.PlanDiscussionCreateInput, principal string, store *storage.Store) (*models.PlanDiscussion, error) {
	planDiscussion := &models.PlanDiscussion{
		ModelPlanID: input.ModelPlanID,
		Content:     input.Content,
		Status:      models.DiscussionUnAnswered,
		CreatedBy:   principal,
		ModifiedBy:  principal,
	}

	result, err := store.PlanDiscussionCreate(logger, planDiscussion)
	return result, err
}

// UpdatePlanDiscussion implements resolver logic to update a plan Discussion object
func UpdatePlanDiscussion(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal string, store *storage.Store) (*models.PlanDiscussion, error) {
	// Get existing discussion
	existingDiscussion, err := store.PlanDiscussionByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChanges(changes, existingDiscussion)
	if err != nil {
		return nil, err
	}
	existingDiscussion.ModifiedBy = principal

	result, err := store.PlanDiscussionUpdate(logger, existingDiscussion)
	return result, err
}

// DeletePlanDiscussion implements resolver logic to Delete a plan Discussion object
func DeletePlanDiscussion(logger *zap.Logger, id uuid.UUID, principal string, store *storage.Store) (*models.PlanDiscussion, error) {
	result, err := store.PlanDiscussionDelete(logger, id)
	return result, err
}

// CreateDiscussionReply implements resolver logic to create a Discussion reply object
func CreateDiscussionReply(logger *zap.Logger, input *model.DiscussionReplyCreateInput, principal string, store *storage.Store) (*models.DiscussionReply, error) {
	discussionReply := &models.DiscussionReply{
		DiscussionID: input.DiscussionID,
		Content:      input.Content,
		Resolution:   input.Resolution,
		CreatedBy:    principal,
		ModifiedBy:   principal,
	}

	result, err := store.DiscussionReplyCreate(logger, discussionReply)
	return result, err
}

// UpdateDiscussionReply implements resolver logic to update a Discussion reply object
func UpdateDiscussionReply(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal string, store *storage.Store) (*models.DiscussionReply, error) {
	// Get existing reply
	existingReply, err := store.DiscussionReplyByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChanges(changes, existingReply)
	if err != nil {
		return nil, err
	}
	existingReply.ModifiedBy = principal

	result, err := store.DiscussionReplyUpdate(logger, existingReply)
	return result, err
}

// DeleteDiscussionReply implements resolver logic to Delete a Discussion reply object
func DeleteDiscussionReply(logger *zap.Logger, id uuid.UUID, principal string, store *storage.Store) (*models.DiscussionReply, error) {
	result, err := store.DiscussionReplyDelete(logger, id)
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
