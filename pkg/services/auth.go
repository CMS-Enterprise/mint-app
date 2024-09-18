package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

// HasAnyRole authorizes a user as having any in a collection of given roles
func HasAnyRole(ctx context.Context, roles []model.Role) (bool, error) {
	for _, role := range roles {
		userHasRole, err := HasRole(ctx, role)
		if err != nil {
			return false, err
		}

		if userHasRole {
			return true, nil
		}
	}

	return false, nil
}

// HasRole authorizes a user as having a given role
func HasRole(ctx context.Context, role model.Role) (bool, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	switch role {
	case model.RoleMintUser:
		if !principal.AllowUSER() {
			logger.Info("does not have MINT job code")
			return false, nil
		}
		logger.Info("user authorized as MINT user", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleMintAssessment:
		if !principal.AllowASSESSMENT() {
			logger.Info("does not have ADMIN job code")
			return false, nil
		}
		logger.Info("user authorized as ADMIN member", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleMintMac:
		if !principal.AllowMAC() {
			logger.Info("does not have MAC job code")
			return false, nil
		}
		logger.Info("user authorized as MAC member", zap.Bool("Authorized", true))
		return true, nil
	default:
		logger.With(zap.String("Role", role.String())).Info("Unrecognized user role")
		return false, nil
	}
}
