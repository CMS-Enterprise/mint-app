package echimpcache

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

// echimpCacheTimeHours is the length of time before a echimpCache needs to be refreshed
const echimpCacheTimeHours = 3

var CRAndTDLCache *crAndTDLCache

func GetECHIMPCrAndTDLCache() *crAndTDLCache {
	if CRAndTDLCache == nil {
		CRAndTDLCache = &crAndTDLCache{}
	}
	return CRAndTDLCache
}

type crAndTDLCache struct {
	lastChecked      time.Time
	crs              []*models.EChimpCR
	CRsByModelPlanID map[uuid.UUID][]*models.EChimpCR
	CRByCRNumber     map[string]*models.EChimpCR

	tdls              []*models.EChimpTDL
	TDLsByModelPlanID map[uuid.UUID][]*models.EChimpTDL
	TDLsByCRNumber    map[string]*models.EChimpTDL
}

func (c *crAndTDLCache) IsOld() bool {
	// Calculate the cache expiration time by adding the duration to the last checked time
	expirationTime := c.lastChecked.Add(echimpCacheTimeHours * time.Hour)
	// Return true if the current time is after the expiration time
	return time.Now().After(expirationTime)

}
