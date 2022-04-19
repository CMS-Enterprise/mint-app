package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/google/uuid"
)

func (r *modelPlanResolver) CmmiGroups(ctx context.Context, obj *models.ModelPlan) ([]model.CMMIGroup, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var cmmiGroups []model.CMMIGroup

	for _, item := range obj.CMMIGroup {
		cmmiGroups = append(cmmiGroups, model.CMMIGroup(item))
	}

	return cmmiGroups, nil
}

func (r *modelPlanResolver) Basics(ctx context.Context, obj *models.ModelPlan) (*models.PlanBasics, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.FetchPlanBasicsByModelPlanID(logger, &principal, obj.ID, r.store)
}

func (r *modelPlanResolver) Milestones(ctx context.Context, plan *models.ModelPlan) (*models.PlanMilestones, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.FetchPlanMilestonesByModelPlanID(logger, &principal, plan.ID, r.store)
}

func (r *mutationResolver) CreateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)

	plan.CreatedBy = models.StringPointer(appcontext.Principal(ctx).ID())
	plan.ModifiedBy = plan.CreatedBy
	createdPlan, err := r.store.ModelPlanCreate(ctx, plan)

	return createdPlan, err
}

func (r *mutationResolver) CreatePlanBasics(ctx context.Context, input model.PlanBasicsInput) (*models.PlanBasics, error) {
	basics := ConvertToPlanBasics(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanBasicsResolver(logger, basics, &principal, r.store)
}

func (r *mutationResolver) UpdateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)
	principal := appcontext.Principal(ctx).ID()
	//TODO clean this up
	plan.ModifiedBy = &principal

	retPlan, err := r.store.ModelPlanUpdate(ctx, plan)
	return retPlan, err
}

func (r *mutationResolver) UpdatePlanBasics(ctx context.Context, input model.PlanBasicsInput) (*models.PlanBasics, error) {
	basics := ConvertToPlanBasics(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanBasicsResolver(logger, basics, &principal, r.store)
}

func (r *mutationResolver) CreatePlanMilestones(ctx context.Context, input model.PlanMilestonesInput) (*models.PlanMilestones, error) {
	basics := ConvertToPlanMilestonesModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanMilestonesResolver(logger, basics, &principal, r.store)
}

func (r *mutationResolver) UpdatePlanMilestones(ctx context.Context, input model.PlanMilestonesInput) (*models.PlanMilestones, error) {
	basics := ConvertToPlanMilestonesModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanMilestonesResolver(logger, basics, &principal, r.store)
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
	plan, err := r.store.ModelPlanGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	//TODO add job code authorization Checks?

	return plan, nil
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
	plans, err := r.store.ModelPlanCollectionByUser(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	return plans, nil
}

// ModelPlan returns generated.ModelPlanResolver implementation.
func (r *Resolver) ModelPlan() generated.ModelPlanResolver { return &modelPlanResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type modelPlanResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
