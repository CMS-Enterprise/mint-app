package resolvers

import (
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

// GetEChimpTDLS returns echimptdls from the cache
func GetEChimpTDLS(echimpS3Client *s3.S3Client) ([]*models.EChimpTDL, error) {
	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client)
	if err != nil {
		return nil, err
	}
	return data.TDls, nil
}

// GetEchimpCRAndTdls returns a union of EChimp CR and TDLs from the cache
func GetEchimpCRAndTdls(echimpS3Client *s3.S3Client) ([]models.EChimpCRAndTDLS, error) {
	data, err := echimpcache.GetECHIMPCrAndTDLCache(echimpS3Client)
	if err != nil {
		return nil, err
	}

	return data.AllCrsAndTDLS, nil
}
