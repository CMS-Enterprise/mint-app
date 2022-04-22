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
	case model.RoleMintBaseUser:
		if !principal.AllowMINT() {
			logger.Info("does not have EASi job code")
			return false, nil
		}
		logger.Info("user authorized as EASi user", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleMintAdminUser:
		if !principal.AllowADMIN() {
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

// AuthorizeHasEASiRole authorizes that the user can use EASi
func AuthorizeHasEASiRole(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleMintBaseUser)
}

// AuthorizeRequireADMINJobCode authorizes a user as being a member of the
// ADMIN (MINT Admin Team)
func AuthorizeRequireADMINJobCode(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleMintAdminUser)
}
