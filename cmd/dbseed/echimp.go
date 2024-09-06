package main

import (
	"bytes"
	_ "embed"
)

//go:embed data/FFS_CR_DATA.parquet
var fsCrDataParquet []byte

// SeedEChimpBucket uploads EChimp data to MINIO if it has not yet happened
func (s *Seeder) SeedEChimpBucket() {

	crKey := "echimp_cr"

	// Create a reader from the embedded byte slice
	reader := bytes.NewReader(fsCrDataParquet)
	err := s.Config.EChimpClient.UploadFile(reader, crKey)
	if err != nil {
		panic(err)
	}
}
