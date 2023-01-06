package providers

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/models"
)

// UserInfoProvider is an interface to allow injection of any service which will satisfy UserInfo requests
type UserInfoProvider interface {
	FetchUserInfo(context.Context, string) (*models.UserInfo, error)
}
