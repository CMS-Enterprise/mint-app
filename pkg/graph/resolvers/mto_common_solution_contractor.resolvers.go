package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// CreateMTOCommonSolutionContractor is the resolver for the createMTOCommonSolutionContractor field.
func (r *mutationResolver) CreateMTOCommonSolutionContractor(ctx context.Context, key models.MTOCommonSolutionKey, contractTitle *string, contractorName string) (*models.MTOCommonSolutionContractor, error) {
	principal := appcontext.Principal(ctx)
	logger := appcontext.ZLogger(ctx)

	return CreateMTOCommonSolutionContractor(ctx, logger, principal, r.store, r.emailService, r.emailTemplateService, r.addressBook, key, contractTitle, contractorName)
}

// UpdateMTOCommonSolutionContractor is the resolver for the updateMTOCommonSolutionContractor field.
func (r *mutationResolver) UpdateMTOCommonSolutionContractor(ctx context.Context, id uuid.UUID, changes map[string]any) (*models.MTOCommonSolutionContractor, error) {
	principal := appcontext.Principal(ctx)
	logger := appcontext.ZLogger(ctx)

	return UpdateMTOCommonSolutionContractor(ctx, logger, principal, r.store, r.emailService, r.emailTemplateService, r.addressBook, id, changes)
}

// DeleteMTOCommonSolutionContractor is the resolver for the deleteMTOCommonSolutionContractor field.
func (r *mutationResolver) DeleteMTOCommonSolutionContractor(ctx context.Context, id uuid.UUID) (*models.MTOCommonSolutionContractor, error) {
	principal := appcontext.Principal(ctx)
	logger := appcontext.ZLogger(ctx)

	return DeleteMTOCommonSolutionContractor(ctx, logger, principal, r.store, r.emailService, r.emailTemplateService, r.addressBook, id)
}

// MtoCommonSolutionContractor is the resolver for the mtoCommonSolutionContractor field.
func (r *queryResolver) MtoCommonSolutionContractor(ctx context.Context, id uuid.UUID) (*models.MTOCommonSolutionContractor, error) {
	principal := appcontext.Principal(ctx)
	logger := appcontext.ZLogger(ctx)

	return GetMTOCommonSolutionContractor(ctx, logger, principal, r.store, id)
}
