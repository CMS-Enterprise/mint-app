package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (r *modelPlanResolver) CmsCenters(ctx context.Context, obj *models.ModelPlan) ([]models.CMSCenter, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var cmsCenters []models.CMSCenter

	for _, item := range obj.CMSCenters {
		cmsCenters = append(cmsCenters, models.CMSCenter(item))
	}

	return cmsCenters, nil
}

func (r *modelPlanResolver) CmmiGroups(ctx context.Context, obj *models.ModelPlan) ([]model.CMMIGroup, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var cmmiGroups []model.CMMIGroup

	for _, item := range obj.CMMIGroups {
		cmmiGroups = append(cmmiGroups, model.CMMIGroup(item))
	}

	return cmmiGroups, nil
}

func (r *modelPlanResolver) Basics(ctx context.Context, obj *models.ModelPlan) (*models.PlanBasics, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.PlanBasicsGetByModelPlanID(logger, &principal, obj.ID, r.store)
}

func (r *modelPlanResolver) Milestones(ctx context.Context, obj *models.ModelPlan) (*models.PlanMilestones, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.FetchPlanMilestonesByModelPlanID(logger, &principal, obj.ID, r.store)
}

func (r *modelPlanResolver) Collaborators(ctx context.Context, obj *models.ModelPlan) ([]*models.PlanCollaborator, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	collaborators, err := resolvers.FetchCollaboratorsByModelPlanID(logger, &principal, obj.ID, r.store)

	return collaborators, err
}

func (r *modelPlanResolver) Discussions(ctx context.Context, obj *models.ModelPlan) ([]*models.PlanDiscussion, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDiscussionCollectionByModelPlanID(logger, obj.ID, r.store)
}

func (r *mutationResolver) CreateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()
	principalInfo, err := r.service.FetchUserInfo(ctx, principal)
	if err != nil { //if can't get user info, use EUAID as commonName
		tempPrincipalInfo := models.UserInfo{
			EuaUserID:  principal,
			CommonName: principal,
		}
		principalInfo = &tempPrincipalInfo
	}

	plan := ConvertToModelPlan(&input)

	return resolvers.ModelPlanCreate(logger, plan, r.store, principalInfo)
}

func (r *mutationResolver) CreatePlanCollaborator(ctx context.Context, input model.PlanCollaboratorInput) (*models.PlanCollaborator, error) {
	collaborator := ConvertToPlanCollaborator(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanCollaborator(logger, collaborator, &principal, r.store)
}

func (r *mutationResolver) UpdatePlanCollaborator(ctx context.Context, input model.PlanCollaboratorInput) (*models.PlanCollaborator, error) {
	collaborator := ConvertToPlanCollaborator(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanCollaborator(logger, collaborator, &principal, r.store)
}

func (r *mutationResolver) DeletePlanCollaborator(ctx context.Context, input model.PlanCollaboratorInput) (*models.PlanCollaborator, error) {
	collaborator := ConvertToPlanCollaborator(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.DeletePlanCollaborator(logger, collaborator, &principal, r.store)
}

func (r *mutationResolver) CreatePlanBasics(ctx context.Context, input model.PlanBasicsInput) (*models.PlanBasics, error) {
	basics := ConvertToPlanBasics(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanBasics(logger, basics, &principal, r.store)
}

func (r *mutationResolver) UpdateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.ModelPlanUpdate(logger, plan, &principal, r.store)
}

func (r *mutationResolver) UpdatePlanBasics(ctx context.Context, input model.PlanBasicsInput) (*models.PlanBasics, error) {
	basics := ConvertToPlanBasics(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanBasics(logger, basics, &principal, r.store)
}

func (r *mutationResolver) CreatePlanMilestones(ctx context.Context, input model.PlanMilestonesInput) (*models.PlanMilestones, error) {
	basics := ConvertToPlanMilestonesModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanMilestones(logger, basics, &principal, r.store)
}

func (r *mutationResolver) UpdatePlanMilestones(ctx context.Context, input model.PlanMilestonesInput) (*models.PlanMilestones, error) {
	basics := ConvertToPlanMilestonesModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanMilestones(logger, basics, &principal, r.store)
}

func (r *mutationResolver) CreatePlanDiscussion(ctx context.Context, input model.PlanDiscussionInput) (*models.PlanDiscussion, error) {
	discussion := ConvertToPlanDiscussion(&input)

	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanDiscussion(logger, discussion, &principal, r.store)
}

func (r *mutationResolver) UpdatePlanDiscussion(ctx context.Context, input model.PlanDiscussionInput) (*models.PlanDiscussion, error) {
	discussion := ConvertToPlanDiscussion(&input)

	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanDiscussion(logger, discussion, &principal, r.store)
}

func (r *mutationResolver) DeletePlanDiscussion(ctx context.Context, input model.PlanDiscussionInput) (*models.PlanDiscussion, error) {
	discussion := ConvertToPlanDiscussion(&input)

	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.DeletePlanDiscussion(logger, discussion, &principal, r.store)
}

func (r *mutationResolver) CreateDiscussionReply(ctx context.Context, input model.DiscussionReplyInput) (*models.DiscussionReply, error) {
	reply := ConvertToDiscussionReply(&input)

	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreateDiscussionReply(logger, reply, &principal, r.store)
}

func (r *mutationResolver) UpdateDiscussionReply(ctx context.Context, input model.DiscussionReplyInput) (*models.DiscussionReply, error) {
	reply := ConvertToDiscussionReply(&input)

	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdateDiscussionReply(logger, reply, &principal, r.store)
}

func (r *mutationResolver) DeleteDiscussionReply(ctx context.Context, input model.DiscussionReplyInput) (*models.DiscussionReply, error) {
	reply := ConvertToDiscussionReply(&input)

	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.DeleteDiscussionReply(logger, reply, &principal, r.store)
}

func (r *planDiscussionResolver) Replies(ctx context.Context, obj *models.PlanDiscussion) ([]*models.DiscussionReply, error) {
	//TODO see if you can check if the PlanDiscussion already has replies, and if not go to DB, otherwise return the replies
	logger := appcontext.ZLogger(ctx)
	return resolvers.DiscussionReplyCollectionByDiscusionID(logger, obj.ID, r.store)
}

func (r *queryResolver) CurrentUser(ctx context.Context) (*model.CurrentUser, error) {
	ldUser := flags.Principal(ctx)
	userKey := ldUser.GetKey()
	signedHash := r.ldClient.SecureModeHash(ldUser)

	currentUser := model.CurrentUser{
		LaunchDarkly: &model.LaunchDarklySettings{
			UserKey:    userKey,
			SignedHash: signedHash,
		},
	}
	return &currentUser, nil
}

func (r *queryResolver) ModelPlan(ctx context.Context, id uuid.UUID) (*models.ModelPlan, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.ModelPlanGetByID(logger, principal, id, r.store)
}

func (r *queryResolver) PlanBasics(ctx context.Context, id uuid.UUID) (*models.PlanBasics, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.FetchPlanBasicsByID(logger, id, r.store)
}

func (r *queryResolver) PlanMilestones(ctx context.Context, id uuid.UUID) (*models.PlanMilestones, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.FetchPlanMilestonesByID(logger, id, r.store)
}

func (r *queryResolver) ModelPlanCollection(ctx context.Context) ([]*models.ModelPlan, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.ModelPlanCollectionByUser(logger, principal, r.store)
}

func (r *queryResolver) CedarPersonsByCommonName(ctx context.Context, commonName string) ([]*models.UserInfo, error) {
	response, err := r.service.SearchCommonNameContains(ctx, commonName)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func (r *userInfoResolver) Email(ctx context.Context, obj *models.UserInfo) (string, error) {
	return string(obj.Email), nil
}

// ModelPlan returns generated.ModelPlanResolver implementation.
func (r *Resolver) ModelPlan() generated.ModelPlanResolver { return &modelPlanResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// PlanDiscussion returns generated.PlanDiscussionResolver implementation.
func (r *Resolver) PlanDiscussion() generated.PlanDiscussionResolver {
	return &planDiscussionResolver{r}
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// UserInfo returns generated.UserInfoResolver implementation.
func (r *Resolver) UserInfo() generated.UserInfoResolver { return &userInfoResolver{r} }

type modelPlanResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type planDiscussionResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userInfoResolver struct{ *Resolver }
