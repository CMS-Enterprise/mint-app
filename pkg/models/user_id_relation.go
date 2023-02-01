package models

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

type userIDRelation struct {
	UserID uuid.UUID `json:"userId" db:"user_id"`
}

// NewUserIDRelation returns a user ID relation object
func NewUserIDRelation(userID uuid.UUID) userIDRelation {
	return userIDRelation{
		UserID: userID,
	}
}
func (b *userIDRelation) UserAccount(ctx context.Context) *authentication.UserAccount {
	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, b.UserID)
	return account

}
