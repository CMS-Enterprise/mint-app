package services

import (
	"context"

	"github.com/facebookgo/clock"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (s *ServicesTestSuite) TestNewFetchMetrics() {
	serviceClock := clock.NewMock()
	serviceConfig := NewConfig(zap.NewNop(), nil)
	serviceConfig.clock = serviceClock

	s.Run("golden path returns metric digest", func() {
		fetchMetrics := NewFetchMetrics(serviceConfig)
		startTime := serviceClock.Now()
		endTime := serviceClock.Now()

		metricsDigest, err := fetchMetrics(context.Background(), startTime, endTime)

		s.NoError(err)
		s.Equal(models.MetricsDigest{}, metricsDigest)
	})

}
