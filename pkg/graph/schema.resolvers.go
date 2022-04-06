package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
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

func (r *mutationResolver) UpdateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {

	now := time.Now()
	plan := models.ModelPlan{
		ID:                      *input.ID,
		Requester:               null.StringFromPtr(input.Requester),
		RequesterComponent:      null.StringFromPtr(input.RequesterComponent),
		MainPointOfContact:      null.StringFromPtr(input.MainPointOfContact),
		PointOfContactComponent: null.StringFromPtr(input.PointOfContactComponent),
		CreatedBy:               null.StringFromPtr(input.CreatedBy),
		CreatedDts:              input.CreatedDts,
		ModifiedBy:              null.StringFrom(appcontext.Principal(ctx).ID()), //User who submitted request
		ModifiedDts:             &now,
	}

	retPlan, err := r.store.ModelPlanUpdate(ctx, &plan)
	return retPlan, err
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
