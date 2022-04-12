package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/google/uuid"
)

func (r *mutationResolver) CreateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)

	plan.CreatedBy = models.StringPointer(appcontext.Principal(ctx).ID())
	plan.ModifiedBy = plan.CreatedBy
	createdPlan, err := r.store.ModelPlanCreate(ctx, plan)

	return createdPlan, err
}

func (r *mutationResolver) CreatePlanBasics(ctx context.Context, input model.CreatePlanBasicsRequestInput) (*model.CreatePlanBasicsPayload, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanBasicsResolver(logger, input, principal, r.store)
}

func (r *mutationResolver) UpdateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)
	principal := appcontext.Principal(ctx).ID()
	//TODO clean this up
	plan.ModifiedBy = &principal

	retPlan, err := r.store.ModelPlanUpdate(ctx, plan)
	return retPlan, err
}

func (r *planBasicsResolver) ModelName(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *planBasicsResolver) ModelCategory(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *planBasicsResolver) CmsCenter(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *planBasicsResolver) CmmiGroup(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *planBasicsResolver) ModelType(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.ModelType.String, nil
}

func (r *planBasicsResolver) Problem(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.Problem.String, nil
}

func (r *planBasicsResolver) Goal(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.Goal.String, nil
}

func (r *planBasicsResolver) TestInventions(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.TestInventions.String, nil
}

func (r *planBasicsResolver) Note(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.Note.String, nil
}

func (r *planBasicsResolver) CreatedBy(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.CreatedBy.String, nil
}

func (r *planBasicsResolver) ModifiedBy(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.ModifiedBy.String, nil
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

func (r *queryResolver) ModelPlanCollection(ctx context.Context) ([]*models.ModelPlan, error) {
	plans, err := r.store.ModelPlanCollectionByUser(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	return plans, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// PlanBasics returns generated.PlanBasicsResolver implementation.
func (r *Resolver) PlanBasics() generated.PlanBasicsResolver { return &planBasicsResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type planBasicsResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
