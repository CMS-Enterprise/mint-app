package main

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/echimptestdata"
)

// SeedEChimpBucket uploads EChimp data to MINIO if it has not yet happened
func (s *Seeder) SeedEChimpBucket() {
	err := echimptestdata.SeedEChimpTestData(s.Config.EChimpClient)
	if err != nil {
		panic(err)
	}

}
