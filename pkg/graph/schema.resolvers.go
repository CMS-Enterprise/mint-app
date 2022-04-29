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

func (r *modelPlanResolver) Documents(ctx context.Context, obj *models.ModelPlan) ([]*models.PlanDocument, error) {
	logger := appcontext.ZLogger(ctx)

	documents, err := resolvers.PlanDocumentsReadByModelPlanID(logger, obj.ID, r.store, r.s3Client)
	return documents, err
}

func (r *mutationResolver) CreateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	plan := ConvertToModelPlan(&input)
	plan.CreatedBy = &principal
	plan.ModifiedBy = &principal
	return resolvers.ModelPlanCreate(logger, plan, r.store)
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

	return resolvers.CreatePlanBasicsResolver(logger, basics, &principal, r.store)
}

func (r *mutationResolver) UpdateModelPlan(ctx context.Context, input model.ModelPlanInput) (*models.ModelPlan, error) {
	plan := ConvertToModelPlan(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	//TODO clean this up
	plan.ModifiedBy = &principal
	return resolvers.ModelPlanUpdate(logger, plan, r.store)
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

	return resolvers.CreatePlanMilestones(logger, basics, &principal, r.store)
}

func (r *mutationResolver) UpdatePlanMilestones(ctx context.Context, input model.PlanMilestonesInput) (*models.PlanMilestones, error) {
	basics := ConvertToPlanMilestonesModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanMilestones(logger, basics, &principal, r.store)
}

func (r *mutationResolver) CreatePlanDocument(ctx context.Context, input model.PlanDocumentInput) (*model.PlanDocumentPayload, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	payload, err := resolvers.PlanDocumentCreate(logger, &input, &principal, r.store, r.s3Client)

	return payload, err
}

func (r *mutationResolver) UpdatePlanDocument(ctx context.Context, input model.PlanDocumentInput) (*model.PlanDocumentPayload, error) {
	document := ConvertToPlanDocumentModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDocumentUpdate(logger, r.s3Client, document, &principal, r.store)
}

func (r *mutationResolver) DeletePlanDocument(ctx context.Context, input model.PlanDocumentInput) (int, error) {
	document := ConvertToPlanDocumentModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDocumentDelete(logger, document, &principal, r.store)
}

func (r *planDocumentResolver) OtherType(ctx context.Context, obj *models.PlanDocument) (*string, error) {
	return obj.OtherTypeDescription, nil
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

func (r *queryResolver) PlanDocument(ctx context.Context, id uuid.UUID) (*models.PlanDocument, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDocumentRead(logger, id, r.store)
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

// PlanDocument returns generated.PlanDocumentResolver implementation.
func (r *Resolver) PlanDocument() generated.PlanDocumentResolver { return &planDocumentResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// UserInfo returns generated.UserInfoResolver implementation.
func (r *Resolver) UserInfo() generated.UserInfoResolver { return &userInfoResolver{r} }

type modelPlanResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type planDocumentResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userInfoResolver struct{ *Resolver }
