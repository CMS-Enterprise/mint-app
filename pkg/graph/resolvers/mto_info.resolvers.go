package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/generated"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// ReadyForReviewByUserAccount is the resolver for the readyForReviewByUserAccount field.
func (r *mTOInfoResolver) ReadyForReviewByUserAccount(ctx context.Context, obj *models.MTOInfo) (*authentication.UserAccount, error) {
	if obj.ReadyForReviewBy == nil {
		return nil, nil
	}
	return UserAccountGetByIDLOADER(ctx, *obj.ReadyForReviewBy)
}

// MTOInfo returns generated.MTOInfoResolver implementation.
func (r *Resolver) MTOInfo() generated.MTOInfoResolver { return &mTOInfoResolver{r} }

type mTOInfoResolver struct{ *Resolver }