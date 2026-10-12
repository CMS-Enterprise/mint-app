package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// GetWaiverInfoByModelPlanID returns waiver info for a given model plan ID
// It will always fetch all common waivers,
func GetWaiverInfoByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) (*models.WaiverInfo, error) {
	commonWaivers, err := GetAllCommonWaiversByModelPlanID(ctx, &modelPlanID)
	if err != nil {
		return nil, err
	}
	return models.NewWaiverInfo(modelPlanID, commonWaivers), nil

}
