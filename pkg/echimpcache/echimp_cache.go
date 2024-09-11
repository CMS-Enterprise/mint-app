package echimpcache

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/parquet"
	"github.com/cmsgov/mint-app/pkg/s3"
)

// echimpCacheTimeHours is the length of time before a echimpCache needs to be refreshed
const echimpCacheTimeHours = 3
const crKey = "echimp_cr"
const tdlKey = "echimp_tdl"

var CRAndTDLCache *crAndTDLCache

func GetECHIMPCrAndTDLCache(client *s3.S3Client) (*crAndTDLCache, error) {
	if CRAndTDLCache == nil {
		CRAndTDLCache = &crAndTDLCache{}
	}
	if CRAndTDLCache.IsOld() {
		err := CRAndTDLCache.refreshCache(client)
		if err != nil {
			return nil, err
		}
	}
	return CRAndTDLCache, nil
}

type crAndTDLCache struct {
	lastChecked      time.Time
	CRs              []*models.EChimpCR
	CRsByModelPlanID map[uuid.UUID][]*models.EChimpCR
	CRByCRNumber     map[string]*models.EChimpCR

	TDls              []*models.EChimpTDL
	TDLsByModelPlanID map[uuid.UUID][]*models.EChimpTDL
	TDLsByCRNumber    map[string]*models.EChimpTDL
}

func (c *crAndTDLCache) IsOld() bool {
	// Calculate the cache expiration time by adding the duration to the last checked time
	expirationTime := c.lastChecked.Add(echimpCacheTimeHours * time.Hour)
	// Return true if the current time is after the expiration time
	return time.Now().After(expirationTime)

}

func (c *crAndTDLCache) refreshCache(client *s3.S3Client) error {

	crs, err := parquet.ReadFromS3[*models.EChimpCR](client, crKey)
	if err != nil {
		return err
	}
	c.CRs = crs

	tdls, err := parquet.ReadFromS3[*models.EChimpTDL](client, tdlKey)
	if err != nil {
		return err
	}
	c.TDls = tdls
	c.lastChecked = time.Now()
	return nil

}
