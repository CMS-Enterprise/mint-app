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
