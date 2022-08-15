package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/graph/model"
)

// HasRole authorizes a user as having a given role
func HasRole(ctx context.Context, role model.Role) (bool, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	switch role {
	case model.RoleMintUser:
		if !principal.AllowUSER() {
			logger.Info("does not have EASi job code")
			return false, nil
		}
		logger.Info("user authorized as EASi user", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleMintAssessment:
		if !principal.AllowASSESSMENT() {
			logger.Info("does not have ADMIN job code")
			return false, nil
		}
		logger.Info("user authorized as ADMIN member", zap.Bool("Authorized", true))
		return true, nil
	default:
		logger.With(zap.String("Role", role.String())).Info("Unrecognized user role")
		return false, nil
	}
}
