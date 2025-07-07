package resolvers

import (
	"github.com/google/uuid"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/echimpcache"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

// GetEchimpCRAndTdlsByModelPlanID returns a union of EChimp CR and TDLs from the cache for a given model plan
func GetEchimpCRAndTdlsByModelPlanID(echimpS3Client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger, modelPlanID uuid.UUID) ([]models.EChimpCRAndTDLS, error) {

	if echimpS3Client.ExpectNoBucket() {
		return []models.EChimpCRAndTDLS{}, nil // In dev, we don't expect a bucket to exist, so return Return empty slice in dev, nil
	}

	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client, viperConfig, logger)
	if err != nil {
		return nil, err
	}

	return data.CrsAndTDLsByModelPlanID[modelPlanID], nil
}
