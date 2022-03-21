package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
)

// HasRole authorizes a user as having a given role
func HasRole(ctx context.Context, role model.Role) (bool, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	switch role {
	case model.RoleEasiUser:
		if !principal.AllowEASi() {
			logger.Info("does not have EASi job code")
			return false, nil
		}
		logger.Info("user authorized as EASi user", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleEasiGovteam:
		if !principal.AllowGRT() {
			logger.Info("does not have Govteam job code")
			return false, nil
		}
		logger.Info("user authorized as Govteam member", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleEasi508Tester:
		if !principal.Allow508Tester() {
			logger.Info("does not have 508 tester job code")
			return false, nil
		}
		logger.Info("user authorized as 508 Tester", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleEasi508User:
		if !principal.Allow508User() {
			logger.Info("does not have 508 User job code")
			return false, nil
		}
		logger.Info("user authorized as 508 User", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleEasi508TesterOrUser:
		is508UserOrTester := principal.Allow508Tester() || principal.Allow508User()
		if !is508UserOrTester {
			logger.Info("does not have 508 User nor Tester job code")
			return false, nil
		}
		return true, nil
	default:
		logger.With(zap.String("Role", role.String())).Info("Unrecognized user role")
		return false, nil
	}
}

// AuthorizeHasEASiRole authorizes that the user can use EASi
func AuthorizeHasEASiRole(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleEasiUser)
}

// AuthorizeRequireGRTJobCode authorizes a user as being a member of the
// GRT (Governance Review Team)
func AuthorizeRequireGRTJobCode(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleEasiGovteam)
}
