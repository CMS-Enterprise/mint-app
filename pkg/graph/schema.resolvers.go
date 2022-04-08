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
	"github.com/guregu/null"
)

func (r *modelPlanResolver) Requester(ctx context.Context, obj *models.ModelPlan) (*string, error) {
	return &obj.Requester.String, nil
}

func (r *modelPlanResolver) RequesterComponent(ctx context.Context, obj *models.ModelPlan) (*string, error) {
	return &obj.RequesterComponent.String, nil
}

func (r *modelPlanResolver) MainPointOfContact(ctx context.Context, obj *models.ModelPlan) (*string, error) {
	return &obj.MainPointOfContact.String, nil
}

func (r *modelPlanResolver) PointOfContactComponent(ctx context.Context, obj *models.ModelPlan) (*string, error) {
	return &obj.PointOfContactComponent.String, nil
}

func (r *modelPlanResolver) CreatedBy(ctx context.Context, obj *models.ModelPlan) (*string, error) {
	return &obj.CreatedBy.String, nil
}

func (r *modelPlanResolver) ModifiedBy(ctx context.Context, obj *models.ModelPlan) (*string, error) {
	return &obj.ModifiedBy.String, nil
}

func (r *mutationResolver) CreateModelPlan(ctx context.Context, input model.CreateModelPlanInput) (*models.ModelPlan, error) {
	plan := models.ModelPlan{
		CreatedBy: null.StringFrom(appcontext.Principal(ctx).ID()),
		Requester: null.StringFrom(input.Requester), //This can never be null.. do we want this?
	}
	plan.ModifiedBy = plan.CreatedBy
	createdPlan, err := r.store.ModelPlanCreate(ctx, &plan)
	return createdPlan, err
}

func (r *mutationResolver) CreatePlanBasics(ctx context.Context, input model.CreatePlanBasicsRequestInput) (*model.CreatePlanBasicsPayload, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanBasicsResolver(logger, input, principal, r.store)
}

func (r *planBasicsResolver) ModelName(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.ModelName.String, nil
}

func (r *planBasicsResolver) ModelCategory(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.ModelCategory.String, nil
}

func (r *planBasicsResolver) CmsCenter(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.CMSCenter.String, nil
}

func (r *planBasicsResolver) CmmiGroup(ctx context.Context, obj *models.PlanBasics) (*string, error) {
	return &obj.CMMIGroup.String, nil
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

// ModelPlan returns generated.ModelPlanResolver implementation.
func (r *Resolver) ModelPlan() generated.ModelPlanResolver { return &modelPlanResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// PlanBasics returns generated.PlanBasicsResolver implementation.
func (r *Resolver) PlanBasics() generated.PlanBasicsResolver { return &planBasicsResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type modelPlanResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type planBasicsResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
