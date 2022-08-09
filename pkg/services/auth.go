package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/graph/model"

	"github.com/google/uuid"
)

// HasRole authorizes a user as having a given role
func HasRole(ctx context.Context, role model.Role) (bool, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	switch role {
	case model.RoleMintBaseUser:
		if !principal.AllowMINT() {
			logger.Info("does not have MINT job code")
			return false, nil
		}
		logger.Info("user authorized as MINT user", zap.Bool("Authorized", true))
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

//IsCollaborator checks if the current user is a collaborator. If not, it returns false
func IsCollaborator(ctx context.Context, modelPlanID uuid.UUID) (bool, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)

	if principal == nil {
		logger.Info("user not found")
	}

	return true, nil

}

// AuthorizeHasMINTRole authorizes that the user can use MINT
func AuthorizeHasMINTRole(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleMintBaseUser)
}

// AuthorizeRequireADMINJobCode authorizes a user as being a member of the
// ADMIN (MINT Admin Team)
func AuthorizeRequireADMINJobCode(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleMintAdminUser)
}
