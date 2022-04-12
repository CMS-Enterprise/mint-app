package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
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

func (r *mutationResolver) CreateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)

	plan.CreatedBy = null.StringFrom(appcontext.Principal(ctx).ID())
	plan.ModifiedBy = plan.CreatedBy
	createdPlan, err := r.store.ModelPlanCreate(ctx, plan)
	// plan.Requester =

	// plan := models.ModelPlan{
	// 	CreatedBy: null.StringFrom(appcontext.Principal(ctx).ID()),
	// 	Requester: null.StringFromPtr(input.Requester), //This can never be null.. do we want this?
	// }
	// plan.ModifiedBy = plan.CreatedBy
	// createdPlan, err := r.store.ModelPlanCreate(ctx, &plan)
	return createdPlan, err
}

func (r *mutationResolver) CreatePlanBasics(ctx context.Context, input model.CreatePlanBasicsRequestInput) (*model.CreatePlanBasicsPayload, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanBasicsResolver(logger, input, principal, r.store)
}

func (r *mutationResolver) UpdateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)
	plan.ModifiedBy = null.StringFrom(appcontext.Principal(ctx).ID())
	// models.ModelPlan{
	// 	ID:                      *input.ID,
	// 	Requester:               null.StringFromPtr(input.Requester),
	// 	RequesterComponent:      null.StringFromPtr(input.RequesterComponent),
	// 	MainPointOfContact:      null.StringFromPtr(input.MainPointOfContact),
	// 	PointOfContactComponent: null.StringFromPtr(input.PointOfContactComponent),
	// 	CreatedBy:               null.StringFromPtr(input.CreatedBy),
	// 	CreatedDts:              input.CreatedDts,
	// 	ModifiedBy:              null.StringFrom(appcontext.Principal(ctx).ID()), //User who submitted request
	// 	ModifiedDts:             &now,
	// }

	retPlan, err := r.store.ModelPlanUpdate(ctx, plan)
	return retPlan, err
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

// PlanBasics returns generated.PlanBasicsResolver implementation.
func (r *Resolver) PlanBasics() generated.PlanBasicsResolver { return &planBasicsResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type modelPlanResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type planBasicsResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func ConvertToModelPlan(mpi *model.ModelPlanInput) *models.ModelPlan {
	plan := models.ModelPlan{
		// ID:                      *mpi.ID,
		Requester:               null.StringFromPtr(mpi.Requester),
		RequesterComponent:      null.StringFromPtr(mpi.RequesterComponent),
		MainPointOfContact:      null.StringFromPtr(mpi.MainPointOfContact),
		PointOfContactComponent: null.StringFromPtr(mpi.PointOfContactComponent),
		CreatedBy:               null.StringFromPtr(mpi.CreatedBy),
		CreatedDts:              mpi.CreatedDts,
		ModifiedBy:              null.StringFromPtr(mpi.ModifiedBy),
		ModifiedDts:             mpi.ModifiedDts,
	}
	if mpi.ID != nil {
		plan.ID = *mpi.ID
	}
	return &plan

}
