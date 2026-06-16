package echimptestdata

import (
	"bytes"
	"context"
	_ "embed"

	"github.com/spf13/viper"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

//go:embed FFS_CR_DATA.parquet
var fsCrDataParquet []byte

//go:embed TDL_DATA.parquet
var tdlDataParquet []byte

// SeedEChimpTestData uploads EChimp data to MINIO if it has not yet happened
func SeedEChimpTestData(eChimpClient *s3.S3Client, viperConfig *viper.Viper) error {
	crKey := viperConfig.GetString(appconfig.AWSS3ECHIMPCRFileName)
	tdlKey := viperConfig.GetString(appconfig.AWSS3ECHIMPTDLFileName)
	err := SeedCRTestData(eChimpClient, crKey)
	if err != nil {
		return err
	}

	return SeedTDLTestData(eChimpClient, tdlKey)

}

// SeedCRTestData uploads the embedded ECHIMP CR parquet data using the provided key.
func SeedCRTestData(eChimpClient *s3.S3Client, crKey string) error {
	crReader := bytes.NewReader(fsCrDataParquet)
	return eChimpClient.UploadFile(context.TODO(), crReader, crKey)
}

// SeedTDLTestData uploads the embedded ECHIMP TDL parquet data using the provided key.
func SeedTDLTestData(eChimpClient *s3.S3Client, tdlKey string) error {
	tdlReader := bytes.NewReader(tdlDataParquet)
	return eChimpClient.UploadFile(context.TODO(), tdlReader, tdlKey)
}
