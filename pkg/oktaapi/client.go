package oktaapi

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// Client defines methods which any Okta API Client should implement
type Client interface {
	FetchUserInfo(context.Context, string) (*models.UserInfo, error)
	SearchByName(context.Context, string) ([]*models.UserInfo, error)
}
