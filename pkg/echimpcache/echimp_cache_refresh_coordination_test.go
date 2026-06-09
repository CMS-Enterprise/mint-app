package echimpcache

import (
	"errors"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestEnsureFreshCollapsesConcurrentFailedRefreshesAndLogsOnce(t *testing.T) {
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCacheTimeMins, 1)

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache := &crAndTDLCache{}
	refreshErr := errors.New("refresh failed")
	var refreshCalls atomic.Int32
	var startOnce sync.Once
	started := make(chan struct{})
	release := make(chan struct{})

	refresh := func() error {
		refreshCalls.Add(1)
		startOnce.Do(func() {
			close(started)
		})
		<-release
		return refreshErr
	}

	const callers = 8
	errs := make(chan error, callers)
	var wg sync.WaitGroup

	for i := 0; i < callers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			errs <- cache.ensureFresh(viperConfig, logger, refresh)
		}()
	}

	<-started
	close(release)
	wg.Wait()
	close(errs)

	for err := range errs {
		require.ErrorIs(t, err, refreshErr)
	}

	assert.Equal(t, int32(1), refreshCalls.Load())
	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "error refreshing ECHIMP CR and TDL cache", entries[0].Message)
}

func TestEnsureFreshUsesFailedRefreshCooldown(t *testing.T) {
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCacheTimeMins, 1)

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache := &crAndTDLCache{}
	refreshErr := errors.New("refresh failed")
	var refreshCalls atomic.Int32

	refresh := func() error {
		refreshCalls.Add(1)
		return refreshErr
	}

	err := cache.ensureFresh(viperConfig, logger, refresh)
	require.ErrorIs(t, err, refreshErr)

	err = cache.ensureFresh(viperConfig, logger, func() error {
		t.Fatal("refresh should not be retried during cooldown")
		return nil
	})
	require.ErrorIs(t, err, refreshErr)

	assert.Equal(t, int32(1), refreshCalls.Load())
	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "error refreshing ECHIMP CR and TDL cache", entries[0].Message)
}

func TestEnsureFreshServesStaleCacheAfterRefreshFailure(t *testing.T) {
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCacheTimeMins, 1)

	core, logs := observer.New(zap.WarnLevel)
	logger := zap.New(core)

	existingCR := &models.EChimpCR{CrNumber: "existing-cr"}
	cache := &crAndTDLCache{
		lastChecked: time.Now().Add(-2 * time.Hour),
		CRs:         []*models.EChimpCR{existingCR},
	}
	refreshErr := errors.New("refresh failed")
	var refreshCalls atomic.Int32

	err := cache.ensureFresh(viperConfig, logger, func() error {
		refreshCalls.Add(1)
		return refreshErr
	})
	require.NoError(t, err)

	err = cache.ensureFresh(viperConfig, logger, func() error {
		t.Fatal("refresh should not be retried during cooldown when serving stale data")
		return nil
	})
	require.NoError(t, err)

	assert.Equal(t, int32(1), refreshCalls.Load())
	assert.Equal(t, []*models.EChimpCR{existingCR}, cache.CRs)

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "using stale ECHIMP cache after refresh failure", entries[0].Message)
}
