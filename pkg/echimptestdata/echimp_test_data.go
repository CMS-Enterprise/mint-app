package echimptestdata

import (
	"bytes"
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
	// TODO: see if you can validate if the data is already seeded so you don't upload multiple copies
	// Create a crReader from the embedded byte slice
	crReader := bytes.NewReader(fsCrDataParquet)
	tldReader := bytes.NewReader(tdlDataParquet)
	err := eChimpClient.UploadFile(crReader, crKey)
	if err != nil {
		return err
	}
	err = eChimpClient.UploadFile(tldReader, tdlKey)
	if err != nil {
		return err
	}
	return nil

}
