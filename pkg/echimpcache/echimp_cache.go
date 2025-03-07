package echimpcache

import (
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/parquet"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

var CRAndTDLCache *crAndTDLCache

// GetECHIMPCrAndTDLCache returns a cached of data for CR and TDLs from an echimp s3 bucket.
// If the time since it was last updated has elapsed, it will fetch the data again
func GetECHIMPCrAndTDLCache(client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger) (*crAndTDLCache, error) {
	if CRAndTDLCache == nil {
		CRAndTDLCache = &crAndTDLCache{}
	}
	if CRAndTDLCache.IsOld(viperConfig) {
		err := CRAndTDLCache.refreshCache(client, viperConfig, logger)
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

func (c *crAndTDLCache) IsOld(viperConfig *viper.Viper) bool {
	// Get the time to cache the data from env vars
	cacheMinutes := viperConfig.GetInt(appconfig.AWSS3ECHIMPCacheTimeMins)

	// if the cache time is less than 0, the data is not cached
	if cacheMinutes <= 0 {
		return true
	}
	// Calculate the cache expiration time by adding the duration to the last checked time
	expirationTime := c.lastChecked.Add(time.Duration(cacheMinutes) * time.Minute)
	// Return true if the current time is after the expiration time
	return time.Now().After(expirationTime)

}

func (c *crAndTDLCache) refreshCache(client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger) error {
	CRKey := viperConfig.GetString(appconfig.AWSS3ECHIMPCRFileName)
	TDLKey := viperConfig.GetString(appconfig.AWSS3ECHIMPTDLFileName)

	crsRaw, err := parquet.ReadFromS3[*models.EChimpCRRaw](client, CRKey)
	if err != nil {
		if s3.S3ErrorIsKeyNotFound(err) {
			logger.Error("file not found for ECHIMP CR data", zap.Error(err))
			return nil
		}
		return err
	}
	sanitizedCRS, err := models.ConvertRawCRSToParsed(crsRaw)
	if err != nil {
		return err
	}
	c.CRs = sanitizedCRS

	tdlsRaw, err := parquet.ReadFromS3[*models.EChimpTDLRaw](client, TDLKey)
	if err != nil {
		if s3.S3ErrorIsKeyNotFound(err) {
			logger.Error("file not found for ECHIMP TDL data", zap.Error(err))
			return nil
		}
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
