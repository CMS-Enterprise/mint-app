package echimpcache

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/parquet"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

var CRAndTDLCache *crAndTDLCache
var crAndTDLCacheOnce sync.Once

// failedRefreshCooldown bounds how long we suppress repeated ECHIMP refresh
// attempts after an unsuccessful refresh result. One minute is long enough to
// absorb bursts of identical request traffic without pinning the cache in a
// stale state for long if the underlying issue clears quickly.
const failedRefreshCooldown = time.Minute

// GetECHIMPCrAndTDLCache returns a cached of data for CR and TDLs from an echimp s3 bucket.
// If the time since it was last updated has elapsed, it will fetch the data again
func GetECHIMPCrAndTDLCache(ctx context.Context, client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger) (*crAndTDLCache, error) {
	cache := getOrCreateECHIMPCache()
	logger = logger.With(logfields.EchimpCacheAppSection)

	if err := cache.ensureFresh(viperConfig, logger, func() error {
		return cache.refreshCache(ctx, client, viperConfig, logger)
	}); err != nil {
		return cache, err
	}

	return cache, nil
}

type crAndTDLCache struct {
	mu sync.Mutex

	lastChecked      time.Time
	CRs              []*models.EChimpCR
	CRsByModelPlanID map[uuid.UUID][]*models.EChimpCR
	CRByCRNumber     map[string]*models.EChimpCR

	TDls              []*models.EChimpTDL
	TDLsByModelPlanID map[uuid.UUID][]*models.EChimpTDL
	TDLsByTDLNumber   map[string]*models.EChimpTDL

	AllCrsAndTDLs           []models.EChimpCRAndTDLS
	CrsAndTDLsByModelPlanID map[uuid.UUID][]models.EChimpCRAndTDLS

	refreshInFlight            bool
	refreshDone                chan struct{}
	lastUnsuccessfulRefreshAt  time.Time
	lastUnsuccessfulRefreshErr error
}

func getOrCreateECHIMPCache() *crAndTDLCache {
	crAndTDLCacheOnce.Do(func() {
		CRAndTDLCache = &crAndTDLCache{}
	})

	return CRAndTDLCache
}

func (c *crAndTDLCache) isOld(viperConfig *viper.Viper) bool {
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

func (c *crAndTDLCache) ensureFresh(viperConfig *viper.Viper, logger *zap.Logger, refresh func() error) error {
	for {
		now := time.Now()

		c.mu.Lock()
		if !c.isOld(viperConfig) {
			c.mu.Unlock()
			return nil
		}

		if c.refreshInFlight {
			done := c.refreshDone
			c.mu.Unlock()
			<-done
			continue
		}

		if c.inFailedRefreshCooldown(now) {
			err := c.lastUnsuccessfulRefreshErr
			hasSnapshot := c.hasCachedSnapshot()
			c.mu.Unlock()
			if hasSnapshot || err == nil {
				return nil
			}
			return err
		}

		previousLastChecked := c.lastChecked
		c.refreshInFlight = true
		c.refreshDone = make(chan struct{})
		c.mu.Unlock()

		err := func() (refreshErr error) {
			defer func() {
				if recovered := recover(); recovered != nil {
					refreshErr = fmt.Errorf("panic refreshing ECHIMP CR and TDL cache: %v", recovered)
					logger.Error("panic refreshing ECHIMP CR and TDL cache", zap.Any("panic", recovered))
				}
			}()

			return refresh()
		}()
		result := c.completeRefreshAttempt(previousLastChecked, err)

		if result.err == nil {
			return nil
		}
		if result.hasSnapshot {
			logger.Warn("using stale ECHIMP cache after refresh failure", zap.Error(result.err))
			return nil
		}

		logger.Error("error refreshing ECHIMP CR and TDL cache", zap.Error(result.err))
		return result.err
	}
}

func (c *crAndTDLCache) inFailedRefreshCooldown(now time.Time) bool {
	return !c.lastUnsuccessfulRefreshAt.IsZero() && now.Sub(c.lastUnsuccessfulRefreshAt) < failedRefreshCooldown
}

func (c *crAndTDLCache) hasCachedSnapshot() bool {
	return !c.lastChecked.IsZero()
}

type refreshAttemptResult struct {
	err         error
	hasSnapshot bool
}

func (c *crAndTDLCache) completeRefreshAttempt(previousLastChecked time.Time, refreshErr error) refreshAttemptResult {
	c.mu.Lock()
	defer c.mu.Unlock()

	refreshed := c.lastChecked.After(previousLastChecked)
	hasSnapshot := c.hasCachedSnapshot()

	if refreshErr == nil && refreshed {
		c.lastUnsuccessfulRefreshAt = time.Time{}
		c.lastUnsuccessfulRefreshErr = nil
	} else {
		c.lastUnsuccessfulRefreshAt = time.Now()
		c.lastUnsuccessfulRefreshErr = refreshErr
	}

	done := c.refreshDone
	c.refreshDone = nil
	c.refreshInFlight = false
	close(done)

	return refreshAttemptResult{
		err:         refreshErr,
		hasSnapshot: hasSnapshot,
	}
}

func (c *crAndTDLCache) refreshCache(ctx context.Context, client *s3.S3Client, viperConfig *viper.Viper, logger *zap.Logger) error {
	CRKey := viperConfig.GetString(appconfig.AWSS3ECHIMPCRFileName)
	TDLKey := viperConfig.GetString(appconfig.AWSS3ECHIMPTDLFileName)

	crsRaw, err := parquet.ReadFromS3[*models.EChimpCRRaw](ctx, client, CRKey)
	if err != nil {
		if s3.S3ErrorIsKeyNotFound(err) {
			logger.Error("file not found for ECHIMP CR data", zap.String("key", CRKey), zap.Error(err))
			return nil
		}
		return err
	}

	sanitizedCRS, err := models.ConvertRawCRSToParsed(crsRaw)
	if err != nil {
		return err
	}

	tdlsRaw, err := parquet.ReadFromS3[*models.EChimpTDLRaw](ctx, client, TDLKey)
	if err != nil {
		if s3.S3ErrorIsKeyNotFound(err) {
			logger.Error("file not found for ECHIMP TDL data", zap.String("key", TDLKey), zap.Error(err))
			return nil
		}
		return err
	}

	sanitizedTDLS, err := models.ConvertRawTDLSToParsed(tdlsRaw)
	if err != nil {
		return err
	}
	allCrsAndTDLs := aggregateAllCrsAndTDLS(sanitizedCRS, sanitizedTDLS)
	crsByModelPlanID := mapCRsByRelatedModelUUIDS(sanitizedCRS)
	tdlsByModelPlanID := mapTDLSByRelatedModelUUIDS(sanitizedTDLS)
	crsAndTDLsByModelPlanID := mapCRAndTDLsByModelPlanID(crsByModelPlanID, tdlsByModelPlanID)
	crByCRNumber := mapCRsByCRNumber(sanitizedCRS)
	tdlsByTDLNumber := mapTDLsByTDLNumber(sanitizedTDLS)

	c.CRs = sanitizedCRS
	c.TDls = sanitizedTDLS
	c.AllCrsAndTDLs = allCrsAndTDLs
	c.CRsByModelPlanID = crsByModelPlanID
	c.TDLsByModelPlanID = tdlsByModelPlanID
	c.CrsAndTDLsByModelPlanID = crsAndTDLsByModelPlanID
	c.CRByCRNumber = crByCRNumber
	c.TDLsByTDLNumber = tdlsByTDLNumber

	c.lastChecked = time.Now()
	return nil

}

func aggregateAllCrsAndTDLS(crs []*models.EChimpCR, tdls []*models.EChimpTDL) []models.EChimpCRAndTDLS {
	allData := []models.EChimpCRAndTDLS{}
	for _, cr := range crs {
		allData = append(allData, cr)

	}
	for _, tdl := range tdls {
		allData = append(allData, tdl)

	}
	return allData

}

func mapCRsByRelatedModelUUIDS(crs []*models.EChimpCR) map[uuid.UUID][]*models.EChimpCR {
	allData := map[uuid.UUID][]*models.EChimpCR{}
	for _, cr := range crs {
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

func mapCRsByCRNumber(crs []*models.EChimpCR) map[string]*models.EChimpCR {
	return lo.Associate(crs, func(cr *models.EChimpCR) (string, *models.EChimpCR) {
		return cr.CrNumber, cr
	})
}
func mapTDLsByTDLNumber(tdls []*models.EChimpTDL) map[string]*models.EChimpTDL {
	return lo.Associate(tdls, func(tdl *models.EChimpTDL) (string, *models.EChimpTDL) {
		return tdl.TdlNumber, tdl
	})
}

func mapTDLSByRelatedModelUUIDS(tdls []*models.EChimpTDL) map[uuid.UUID][]*models.EChimpTDL {
	allData := map[uuid.UUID][]*models.EChimpTDL{}
	for _, tdl := range tdls {
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

func mapCRAndTDLsByModelPlanID(crsByModelPlanID map[uuid.UUID][]*models.EChimpCR, tdlsByModelPlanID map[uuid.UUID][]*models.EChimpTDL) map[uuid.UUID][]models.EChimpCRAndTDLS {

	allData := map[uuid.UUID][]models.EChimpCRAndTDLS{}

	for modelPlanID, crs := range crsByModelPlanID {
		converted := []models.EChimpCRAndTDLS{}
		for _, cr := range crs {
			converted = append(converted, cr)

		}
		//don't need to check for first pass
		allData[modelPlanID] = converted
	}

	for modelPlanID, tdls := range tdlsByModelPlanID {
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
