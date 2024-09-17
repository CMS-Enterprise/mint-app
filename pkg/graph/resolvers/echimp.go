package resolvers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/echimpcache"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/s3"
)

// GetEChimpCRs returns echimp CRS from the cache
func GetEChimpCRs(echimpS3Client *s3.S3Client) ([]*models.EChimpCR, error) {

	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client)
	if err != nil {
		return nil, err
	}
	return data.CRs, nil

}

// GetEChimpCRsByModelPlanID returns echimp CRS from the cache for a specific model plan
func GetEChimpCRsByModelPlanID(echimpS3Client *s3.S3Client, modelPlanID uuid.UUID) ([]*models.EChimpCR, error) {

	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client)
	if err != nil {
		return nil, err
	}
	return data.CRsByModelPlanID[modelPlanID], nil

}

// GetEChimpTDLS returns echimptdls from the cache
func GetEChimpTDLS(echimpS3Client *s3.S3Client) ([]*models.EChimpTDL, error) {
	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client)
	if err != nil {
		return nil, err
	}
	return data.TDls, nil
}

// GetEChimpTDLSByModelPlanID from the cache for a specific modelplan
func GetEChimpTDLSByModelPlanID(echimpS3Client *s3.S3Client, modelPlanID uuid.UUID) ([]*models.EChimpTDL, error) {

	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client)
	if err != nil {
		return nil, err
	}
	return data.TDLsByModelPlanID[modelPlanID], nil
}

// GetEchimpCRAndTdls returns a union of EChimp CR and TDLs from the cache
func GetEchimpCRAndTdls(echimpS3Client *s3.S3Client) ([]models.EChimpCRAndTDLS, error) {
	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client)
	if err != nil {
		return nil, err
	}

	return data.AllCrsAndTDLS, nil
}
