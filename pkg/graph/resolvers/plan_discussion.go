package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/providers"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanDiscussion implements resolver logic to create a plan Discussion object
func CreatePlanDiscussion(
	ctx context.Context,
	logger *zap.Logger,
	userInfoProvider providers.UserInfoProvider,
	input *model.PlanDiscussionCreateInput,
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanDiscussion, error) {
	createdByUserInfo, modifiedByUserInfo, err := fetchBaseStructUserInformation(
		ctx,
		userInfoProvider,
		principal.ID(),
		nil,
	)
	if err != nil {
		return nil, err
	}

	planDiscussion := models.NewPlanDiscussion(
		principal.ID(),
		principal.AllowASSESSMENT(),
		input.ModelPlanID,
		input.Content,
		*createdByUserInfo,
		modifiedByUserInfo,
	)

	err = BaseStructPreCreate(logger, planDiscussion, principal, store, true)
	if err != nil {
		return nil, err
	}

	result, err := store.PlanDiscussionCreate(logger, planDiscussion)
	return result, err
}

// UpdatePlanDiscussion implements resolver logic to update a plan Discussion object
func UpdatePlanDiscussion(
	ctx context.Context,
	logger *zap.Logger,
	userInfoProvider providers.UserInfoProvider,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanDiscussion, error) {
	// Get existing discussion
	existingDiscussion, err := store.PlanDiscussionByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingDiscussion, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	createdByUserInfo, err := userInfoProvider.FetchUserInfo(ctx, existingDiscussion.CreatedBy)
	if err != nil {
		return nil, err
	}
	existingDiscussion.CreatedByUserInfo = *createdByUserInfo

	if existingDiscussion.ModifiedBy != nil {
		var modifiedByUserInfo *models.UserInfo
		modifiedByUserInfo, err = userInfoProvider.FetchUserInfo(ctx, *existingDiscussion.ModifiedBy)
		if err != nil {
			return nil, err
		}
		existingDiscussion.ModifiedByUserInfo = modifiedByUserInfo
	} else {
		existingDiscussion.ModifiedByUserInfo = nil
	}

	result, err := store.PlanDiscussionUpdate(logger, existingDiscussion)
	return result, err
}

// DeletePlanDiscussion implements resolver logic to Delete a plan Discussion object
func DeletePlanDiscussion(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.PlanDiscussion, error) {

	existingDiscussion, err := store.PlanDiscussionByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreDelete(logger, existingDiscussion, principal, store, true)
	if err != nil {
		return nil, err
	}
	result, err := store.PlanDiscussionDelete(logger, id)
	return result, err
}

// CreateDiscussionReply implements resolver logic to create a Discussion reply object
func CreateDiscussionReply(
	ctx context.Context,
	userInfoProvider providers.UserInfoProvider,
	logger *zap.Logger,
	input *model.DiscussionReplyCreateInput,
	principal authentication.Principal,
	store *storage.Store,
) (*models.DiscussionReply, error) {
	createdByUserInfo, modifiedByUserInfo, err := fetchBaseStructUserInformation(
		ctx,
		userInfoProvider,
		principal.ID(),
		nil,
	)
	if err != nil {
		return nil, err
	}

	discussionReply := models.NewDiscussionReply(
		principal.ID(),
		principal.AllowASSESSMENT(),
		input.DiscussionID,
		input.Content,
		input.Resolution,
		*createdByUserInfo,
		modifiedByUserInfo,
	)

	err = BaseStructPreCreate(logger, discussionReply, principal, store, true)
	if err != nil {
		return nil, err
	}

	result, err := store.DiscussionReplyCreate(logger, discussionReply)
	return result, err
}

// UpdateDiscussionReply implements resolver logic to update a Discussion reply object
func UpdateDiscussionReply(
	ctx context.Context,
	logger *zap.Logger,
	userInfoProvider providers.UserInfoProvider,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.DiscussionReply, error) {
	// Get existing reply
	existingReply, err := store.DiscussionReplyByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreUpdate(logger, existingReply, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	createdByUserInfo, err := userInfoProvider.FetchUserInfo(ctx, existingReply.CreatedBy)
	if err != nil {
		return nil, err
	}
	existingReply.CreatedByUserInfo = *createdByUserInfo

	if existingReply.ModifiedBy != nil {
		var modifiedByUserInfo *models.UserInfo
		modifiedByUserInfo, err = userInfoProvider.FetchUserInfo(ctx, *existingReply.ModifiedBy)
		if err != nil {
			return nil, err
		}
		existingReply.ModifiedByUserInfo = modifiedByUserInfo
	} else {
		existingReply.ModifiedByUserInfo = nil
	}

	result, err := store.DiscussionReplyUpdate(logger, existingReply)
	return result, err
}

// DeleteDiscussionReply implements resolver logic to Delete a Discussion reply object
func DeleteDiscussionReply(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.DiscussionReply, error) {
	existingReply, err := store.DiscussionReplyByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreDelete(logger, existingReply, principal, store, true)
	if err != nil {
		return nil, err
	}
	result, err := store.DiscussionReplyDelete(logger, id)

	return result, err
}

// DiscussionReplyCollectionByDiscusionID returns all Discussion reply objects by a Discussion ID
func DiscussionReplyCollectionByDiscusionID(logger *zap.Logger, discussionID uuid.UUID, store *storage.Store) ([]*models.DiscussionReply, error) {

	result, err := store.DiscussionReplyCollectionByDiscusionID(logger, discussionID)
	return result, err

}

// PlanDiscussionCollectionByModelPlanID returns all plan discussion objects related to a model plan, as noted by it's ID
func PlanDiscussionCollectionByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanDiscussion, error) {

	result, err := store.PlanDiscussionCollectionByModelPlanID(logger, modelPlanID)
	return result, err
}

func fetchBaseStructUserInformation(
	ctx context.Context,
	userInfoProvider providers.UserInfoProvider,
	createdBy string,
	modifiedBy *string,
) (
	*models.UserInfo,
	*models.UserInfo,
	error,
) {
	var createdByUserInfo, err = userInfoProvider.FetchUserInfo(ctx, createdBy)
	if err != nil {
		return nil, nil, err
	}

	var modifiedByUserInfo *models.UserInfo
	if modifiedBy != nil {
		modifiedByUserInfo, err = userInfoProvider.FetchUserInfo(ctx, *modifiedBy)
		if err != nil {
			return nil, nil, err
		}
	}
	return createdByUserInfo, modifiedByUserInfo, err
}
