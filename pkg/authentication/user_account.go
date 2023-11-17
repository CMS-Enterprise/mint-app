package authentication

import (
	"context"

	"github.com/google/uuid"
)

// UserAccount represents a user from the database
type UserAccount struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Username    *string   `json:"username" db:"username"`
	IsEUAID     bool      `json:"isEUAID" db:"is_euaid"`
	CommonName  string    `json:"commonName" db:"common_name"`
	Locale      string    `json:"locale" db:"locale"`
	Email       string    `json:"email" db:"email"`
	GivenName   string    `json:"given_name" db:"given_name"`
	FamilyName  string    `json:"family_name" db:"family_name"`
	ZoneInfo    string    `json:"zoneinfo" db:"zone_info"`
	HasLoggedIn bool      `json:"hasLoggedIn" db:"has_logged_in"`
}

// type ctxKey string

// const (
// 	userAccountServiceKey = ctxKey("userAccountService")
// )

// GetUserAccountFromDBFunc represents a type of function which takes a context and a user_id uuid and returns a UserAccount
type GetUserAccountFromDBFunc func(ctx context.Context, id uuid.UUID) (*UserAccount, error)

// // UserAccountService returns a GetUserAccountFromDBFunc that is decorating the context
// func UserAccountService(ctx context.Context) GetUserAccountFromDBFunc {
// 	return ctx.Value(userAccountServiceKey).(GetUserAccountFromDBFunc)
// }

// // WithUserAccountService decorates the context with a GetUserAccountFromDBFunc
// func WithUserAccountService(ctx context.Context, accountFunction GetUserAccountFromDBFunc) context.Context {
// 	return context.WithValue(ctx, userAccountServiceKey, accountFunction)
// }

// IsTaggedEntity is a method to satisfy the IsTaggedEntity interface for UserAccount.
func (UserAccount) IsTaggedEntity() {}
