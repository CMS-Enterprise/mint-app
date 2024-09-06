package main

import (
	"bytes"
	_ "embed"
	"fmt"
)

//go:embed data/FFS_CR_DATA.parquet
var fsCrDataParquet []byte

//go:embed data/TDL_DATA.parquet
var tdlDataParquet []byte

// SeedEChimpBucket uploads EChimp data to MINIO if it has not yet happened
func (s *Seeder) SeedEChimpBucket() {

	crKey := "echimp_cr"
	tdlKey := "echimp_tdl"

	// Create a crReader from the embedded byte slice
	crReader := bytes.NewReader(fsCrDataParquet)
	tldReader := bytes.NewReader(tdlDataParquet)
	err := s.Config.EChimpClient.UploadFile(crReader, crKey)
	if err != nil {
		panic(err)
	}
	err = s.Config.EChimpClient.UploadFile(tldReader, tdlKey)
	if err != nil {
		panic(err)
	}
	//TODO: Note that this shouldn't actually be in here. This is just here for testing downloading the parquet file.
	crData, crError := s.Config.EChimpClient.DownloadToMemory(crKey)
	if crError != nil {
		panic(crError)
	}
	fmt.Print(crData)

	tdlData, tdlError := s.Config.EChimpClient.DownloadToMemory(tdlKey)
	if tdlError != nil {
		panic(tdlError)
	}
	fmt.Print(tdlData)
}
