package main

import (
	"bytes"
	_ "embed"
)

// var CRAndTDLCache *crAndTDLCache

// func GetECHIMPCrAndTDLCache() *crAndTDLCache {
// 	if CRAndTDLCache == nil {
// 		CRAndTDLCache = &crAndTDLCache{}
// 	}
// 	return CRAndTDLCache
// }

// type crAndTDLCache struct {
// 	lastChecked      time.Time
// 	crs              []*models.EChimpCR
// 	CRsByModelPlanID map[uuid.UUID][]*models.EChimpCR
// 	CRByCRNumber     map[string]*models.EChimpCR

// 	tdls              []*models.EChimpTDL
// 	TDLsByModelPlanID map[uuid.UUID][]*models.EChimpTDL
// 	TDLsByCRNumber    map[string]*models.EChimpTDL
// }

// func (c *crAndTDLCache) IsOld() bool {
// 	return c.lastChecked.After()

// }

//go:embed data/FFS_CR_DATA.parquet
var fsCrDataParquet []byte

//go:embed data/TDL_DATA.parquet
var tdlDataParquet []byte

const crKey = "echimp_cr"
const tdlKey = "echimp_tdl"

// SeedEChimpBucket uploads EChimp data to MINIO if it has not yet happened
func (s *Seeder) SeedEChimpBucket() {

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

}

// // GetECHIMPCrAndTDL fetches CR and TDL data from a bucket
// func (s *Seeder) GetECHIMPCrAndTDL() []byte {

// 	crData, crError := s.Config.EChimpClient.DownloadToMemory(crKey)
// 	if crError != nil {
// 		panic(crError)
// 	}

// 	s3File, err := s3.NewS3FileReaderWithClient(context.Background(), s.Config.EChimpClient, appconfig.AWSS3ECHIMPBucket, crKey)
// 	if err != nil {
// 		log.Fatalf("Failed to create S3 file reader: %v", err)
// 	}
// 	reader.NewParquetReader()

// 	// Create a reader from the byte array
// 	byteReader := bytes.NewReader(crData)
// 	fr, err := local.NewLocalFileReader("without_predefined_schema.parquet")
// 	parquetFileReader, err := source.NewMemFileReader(byteReader)
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer parquetFileReader.Close()

// 	// Create a Parquet reader
// 	pr, err := reader.NewParquetReader(parquetFileReader, new(models.EChimpCR), 1)
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer pr.ReadStop()
// 	fmt.Print(crData)

// 	// Read all the rows
// 	numRows := int(pr.GetNumRows())
// 	crRecords := make([]models.EChimpCR, numRows)
// 	if err = pr.Read(&crRecords); err != nil {
// 		panic(err)
// 	}

// 	// Print or use your records
// 	for _, cr := range crRecords {
// 		fmt.Printf("%+v\n", cr)
// 	}

// 	tdlData, tdlError := s.Config.EChimpClient.DownloadToMemory(tdlKey)
// 	if tdlError != nil {
// 		panic(tdlError)
// 	}
// 	fmt.Print(tdlData)
// 	return tdlData
// }
