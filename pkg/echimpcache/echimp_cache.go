package echimpcache

import (
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/parquet"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

// TODO (echimp) make the file name configurable by envar file
//TODO: consider making these constants configurable from environment variable

// echimpCacheTimeHours is the length of time before a echimpCache needs to be refreshed
const echimpCacheTimeHours = 3

// CRKey is the name of the file that is stored in the ECHIMP bucket representing all the echimp CR data
const CRKey = "FFS_CR_DATA.parquet"

// TDLKey is the name of the file that is stored in the ECHIMP bucket representing all the echimp TDL data
const TDLKey = "TDL_DATA.parquet"

var CRAndTDLCache *crAndTDLCache

// GetECHIMPCrAndTDLCache returns a cached of data for CR and TDLs from an echimp s3 bucket.
// If the time since it was last updated has elapsed, it will fetch the data again
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
	TDLsByTDLNumber   map[string]*models.EChimpTDL

	AllCrsAndTDLs           []models.EChimpCRAndTDLS
	CrsAndTDLsByModelPlanID map[uuid.UUID][]models.EChimpCRAndTDLS
}

func (c *crAndTDLCache) IsOld() bool {
	// Calculate the cache expiration time by adding the duration to the last checked time
	expirationTime := c.lastChecked.Add(echimpCacheTimeHours * time.Hour)
	// Return true if the current time is after the expiration time
	return time.Now().After(expirationTime)

}

func (c *crAndTDLCache) refreshCache(client *s3.S3Client) error {

	crsRaw, err := parquet.ReadFromS3[*models.EChimpCRRaw](client, CRKey)
	if err != nil {
		return err
	}
	sanitizedCRS, err := models.ConvertRawCRSToParsed(crsRaw)
	if err != nil {
		return err
	}
	c.CRs = sanitizedCRS

	tdlsRaw, err := parquet.ReadFromS3[*models.EChimpTDLRaw](client, TDLKey)
	if err != nil {
		return err
	}
	sanitizedTDLS, err := models.ConvertRawTDLSToParsed(tdlsRaw)
	if err != nil {
		return err
	}
	c.CRs = sanitizedCRS
	c.TDls = sanitizedTDLS
	c.AllCrsAndTDLs = c.aggregateAllCrsAndTDLS()

	c.CRsByModelPlanID = c.mapCRsByRelatedModelUUIDS()
	c.TDLsByModelPlanID = c.mapTDLSByRelatedModelUUIDS()
	c.CrsAndTDLsByModelPlanID = c.mapCRAndTDLsByModelPlanID()

	c.CRByCRNumber = c.mapCRsByCRNumber()

	c.TDLsByTDLNumber = c.mapTDLsByTDLNumber()

	c.lastChecked = time.Now()
	return nil

}

func (c *crAndTDLCache) aggregateAllCrsAndTDLS() []models.EChimpCRAndTDLS {
	allData := []models.EChimpCRAndTDLS{}
	for _, cr := range c.CRs {
		allData = append(allData, cr)

	}
	for _, tdl := range c.TDls {
		allData = append(allData, tdl)

	}
	return allData

}

func (c *crAndTDLCache) mapCRsByRelatedModelUUIDS() map[uuid.UUID][]*models.EChimpCR {
	allData := map[uuid.UUID][]*models.EChimpCR{}
	for _, cr := range c.CRs {
		if cr.AssociatedModelUids == nil {
			continue
		}
		array, arrayExists := allData[*cr.AssociatedModelUids]
		if arrayExists {
			array = append(array, cr)
			allData[*cr.AssociatedModelUids] = array

		} else {

			allData[*cr.AssociatedModelUids] = []*models.EChimpCR{cr}
		}

	}
	return allData
}

func (c *crAndTDLCache) mapCRsByCRNumber() map[string]*models.EChimpCR {
	return lo.Associate(c.CRs, func(cr *models.EChimpCR) (string, *models.EChimpCR) {
		return cr.CrNumber, cr
	})
}
func (c *crAndTDLCache) mapTDLsByTDLNumber() map[string]*models.EChimpTDL {
	return lo.Associate(c.TDls, func(tdl *models.EChimpTDL) (string, *models.EChimpTDL) {
		return tdl.TdlNumber, tdl
	})
}

func (c *crAndTDLCache) mapTDLSByRelatedModelUUIDS() map[uuid.UUID][]*models.EChimpTDL {
	allData := map[uuid.UUID][]*models.EChimpTDL{}
	for _, tdl := range c.TDls {
		if tdl.AssociatedModelUids == nil {
			continue
		}
		array, arrayExists := allData[*tdl.AssociatedModelUids]
		if arrayExists {
			array = append(array, tdl)
			allData[*tdl.AssociatedModelUids] = array

		} else {

			allData[*tdl.AssociatedModelUids] = []*models.EChimpTDL{tdl}
		}

	}
	return allData
}

func (c *crAndTDLCache) mapCRAndTDLsByModelPlanID() map[uuid.UUID][]models.EChimpCRAndTDLS {

	allData := map[uuid.UUID][]models.EChimpCRAndTDLS{}

	for modelPlanID, crs := range c.CRsByModelPlanID {
		converted := []models.EChimpCRAndTDLS{}
		for _, cr := range crs {
			converted = append(converted, cr)

		}
		//don't need to check for first pass
		allData[modelPlanID] = converted
	}

	for modelPlanID, tdls := range c.TDLsByModelPlanID {
		converted := []models.EChimpCRAndTDLS{}
		for _, tdl := range tdls {
			converted = append(converted, tdl)

		}
		existing, exists := allData[modelPlanID]

		if exists {
			existing = append(existing, converted...)
			allData[modelPlanID] = existing
		} else {
			allData[modelPlanID] = converted
		}

	}
	return allData

}
