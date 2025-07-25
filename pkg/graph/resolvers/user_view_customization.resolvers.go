package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/graph/generated"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// UpdateUserViewCustomization is the resolver for the updateUserViewCustomization field.
func (r *mutationResolver) UpdateUserViewCustomization(ctx context.Context, changes map[string]any) (*models.UserViewCustomization, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)

	return UserViewCustomizationUpdate(logger, r.store, principal, changes)
}

// UserViewCustomization is the resolver for the userViewCustomization field.
func (r *queryResolver) UserViewCustomization(ctx context.Context) (*models.UserViewCustomization, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)

	return UserViewCustomizationGetByUserID(logger, r.store, principal)
}

// ViewCustomization is the resolver for the viewCustomization field.
func (r *userViewCustomizationResolver) ViewCustomization(ctx context.Context, obj *models.UserViewCustomization) ([]models.ViewCustomizationType, error) {
	return models.ConvertEnums[models.ViewCustomizationType](obj.ViewCustomization), nil
}

// Solutions is the resolver for the solutions field.
func (r *userViewCustomizationResolver) Solutions(ctx context.Context, obj *models.UserViewCustomization) ([]models.MTOCommonSolutionKey, error) {
	return models.ConvertEnums[models.MTOCommonSolutionKey](obj.Solutions), nil
}

// UserViewCustomization returns generated.UserViewCustomizationResolver implementation.
func (r *Resolver) UserViewCustomization() generated.UserViewCustomizationResolver {
	return &userViewCustomizationResolver{r}
}

type userViewCustomizationResolver struct{ *Resolver }
