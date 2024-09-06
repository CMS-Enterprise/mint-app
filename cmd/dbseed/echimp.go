package main

import (
	"bytes"
	_ "embed"
)

//go:embed data/FFS_CR_DATA.parquet
var fsCrDataParquet []byte

//go:embed data/TDL_DATA.parquet
var tdlDataParquet []byte

// SeedEChimpBucket uploads EChimp data to MINIO if it has not yet happened
func (s *Seeder) SeedEChimpBucket() {

	crKey := "echimp_cr"

	// Create a crReader from the embedded byte slice
	crReader := bytes.NewReader(fsCrDataParquet)
	tldReader := bytes.NewReader(tdlDataParquet)
	err := s.Config.EChimpClient.UploadFile(crReader, crKey)
	if err != nil {
		panic(err)
	}
	err = s.Config.EChimpClient.UploadFile(tldReader, crKey)
	if err != nil {
		panic(err)
	}
}
