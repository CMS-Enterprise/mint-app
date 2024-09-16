package services

import (
	"context"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// NewFetchMetrics returns a service for fetching a metrics digest
func NewFetchMetrics(
	_ Config,
) func(c context.Context, st time.Time, et time.Time) (models.MetricsDigest, error) {
	return func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
		metricsDigest := models.MetricsDigest{}
		return metricsDigest, nil
	}
}
