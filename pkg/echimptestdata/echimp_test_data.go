package echimptestdata

import (
	"bytes"
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/s3"
)

const CRKey = "echimp_cr"
const TDLKey = "echimp_tdl"

//go:embed FFS_CR_DATA.parquet
var fsCrDataParquet []byte

//go:embed TDL_DATA.parquet
var tdlDataParquet []byte

// SeedEChimpTestData uploads EChimp data to MINIO if it has not yet happened
func SeedEChimpTestData(eChimpClient *s3.S3Client) error {

	// TODO: see if you can validate if the data is already seeded so you don't upload multiple copies
	// Create a crReader from the embedded byte slice
	crReader := bytes.NewReader(fsCrDataParquet)
	tldReader := bytes.NewReader(tdlDataParquet)
	err := eChimpClient.UploadFile(crReader, CRKey)
	if err != nil {
		return err
	}
	err = eChimpClient.UploadFile(tldReader, TDLKey)
	if err != nil {
		return err
	}
	return nil

}