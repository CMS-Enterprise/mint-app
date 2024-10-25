package resolvers

import (
	"github.com/google/uuid"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/echimpcache"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

// GetEChimpCRByID returns an echimp CR from the cache by id number if it exists
func GetEChimpCRByID(echimpS3Client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger, id string) (*models.EChimpCR, error) {

	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client, viperConfig, logger)
	if err != nil {
		return nil, err
	}
	return data.CRByCRNumber[id], nil

}

// GetEChimpCRsByModelPlanID returns echimp CRS from the cache for a specific model plan
func GetEChimpCRsByModelPlanID(echimpS3Client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.EChimpCR, error) {

	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client, viperConfig, logger)
	if err != nil {
		return nil, err
	}
	return data.CRsByModelPlanID[modelPlanID], nil

}

// GetEChimpTDLByID returns an Echimp TDL from the cache by id number if it exists
func GetEChimpTDLByID(echimpS3Client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger, id string) (*models.EChimpTDL, error) {
	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client, viperConfig, logger)
	if err != nil {
		return nil, err
	}
	return data.TDLsByTDLNumber[id], nil
}

// GetEChimpTDLSByModelPlanID from the cache for a specific modelplan
func GetEChimpTDLSByModelPlanID(echimpS3Client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger, modelPlanID uuid.UUID) ([]*models.EChimpTDL, error) {

	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client, viperConfig, logger)
	if err != nil {
		return nil, err
	}
	return data.TDLsByModelPlanID[modelPlanID], nil
}

// GetEchimpCRAndTdlsByModelPlanID returns a union of EChimp CR and TDLs from the cache for a given model plan
func GetEchimpCRAndTdlsByModelPlanID(echimpS3Client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger, modelPlanID uuid.UUID) ([]models.EChimpCRAndTDLS, error) {
	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client, viperConfig, logger)
	if err != nil {
		return nil, err
	}

	return data.CrsAndTDLsByModelPlanID[modelPlanID], nil
}
