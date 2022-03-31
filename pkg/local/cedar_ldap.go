package local

import (
	"context"
	"errors"
	"fmt"
	"github.com/cmsgov/mint-app/pkg/shared/apperrors"
	"strings"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

// NewCedarLdapClient returns a fake Cedar LDAP client
func NewCedarLdapClient(logger *zap.Logger) CedarLdapClient {
	return CedarLdapClient{logger: logger}
}

// CedarLdapClient mocks the CEDAR LDAP client for local/test use
type CedarLdapClient struct {
	logger *zap.Logger
}

// FetchUserInfo fetches a user's personal details
func (c CedarLdapClient) FetchUserInfo(_ context.Context, euaID string) (*models.UserInfo, error) {
	if euaID == "" {
		return nil, &apperrors.ValidationError{
			Err:     errors.New("invalid EUA ID"),
			Model:   euaID,
			ModelID: euaID,
		}
	}
	c.logger.Info("Mock FetchUserInfo from LDAP", zap.String("euaID", euaID))
	return &models.UserInfo{
		CommonName: fmt.Sprintf("%s Doe", strings.ToLower(euaID)),
		Email:      models.NewEmailAddress(fmt.Sprintf("%s@local.fake", euaID)),
		EuaUserID:  euaID,
	}, nil
}
