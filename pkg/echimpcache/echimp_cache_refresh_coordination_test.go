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
			errs <- cache.ensureUsableCache(viperConfig, logger, refresh)
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

	err := cache.ensureUsableCache(viperConfig, logger, refresh)
	require.ErrorIs(t, err, refreshErr)

	err = cache.ensureUsableCache(viperConfig, logger, func() error {
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
		crs:         []*models.EChimpCR{existingCR},
	}
	refreshErr := errors.New("refresh failed")
	var refreshCalls atomic.Int32

	err := cache.ensureUsableCache(viperConfig, logger, func() error {
		refreshCalls.Add(1)
		return refreshErr
	})
	require.NoError(t, err)

	err = cache.ensureUsableCache(viperConfig, logger, func() error {
		t.Fatal("refresh should not be retried during cooldown when serving stale data")
		return nil
	})
	require.NoError(t, err)

	assert.Equal(t, int32(1), refreshCalls.Load())
	assert.Equal(t, []*models.EChimpCR{existingCR}, cache.crs)

	entries := logs.All()
	require.Len(t, entries, 1)
	assert.Equal(t, "using stale ECHIMP cache after refresh failure", entries[0].Message)
}

func TestEnsureFreshServesStaleCacheDuringInFlightRefresh(t *testing.T) {
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCacheTimeMins, 1)

	existingCR := &models.EChimpCR{CrNumber: "existing-cr"}
	refreshDone := make(chan struct{})
	cache := &crAndTDLCache{
		lastChecked:     time.Now().Add(-2 * time.Hour),
		crs:             []*models.EChimpCR{existingCR},
		refreshInFlight: true,
		refreshDone:     refreshDone,
	}

	var refreshCalls atomic.Int32
	unexpectedRefreshErr := errors.New("refresh should not be called while serving stale data")
	errs := make(chan error, 1)
	go func() {
		errs <- cache.ensureUsableCache(viperConfig, zap.NewNop(), func() error {
			refreshCalls.Add(1)
			return unexpectedRefreshErr
		})
	}()

	select {
	case err := <-errs:
		require.NoError(t, err)
	case <-time.After(time.Second):
		close(refreshDone)
		t.Fatal("ensureUsableCache blocked instead of serving stale data during in-flight refresh")
	}

	assert.Equal(t, int32(0), refreshCalls.Load())
	assert.Equal(t, []*models.EChimpCR{existingCR}, cache.crs)
}

func TestEnsureFreshCompletesRefreshAttemptAfterPanic(t *testing.T) {
	viperConfig := viper.New()
	viperConfig.Set(appconfig.AWSS3ECHIMPCacheTimeMins, 1)

	core, logs := observer.New(zap.ErrorLevel)
	logger := zap.New(core)

	cache := &crAndTDLCache{}
	err := cache.ensureUsableCache(viperConfig, logger, func() error {
		panic("refresh exploded")
	})
	require.Error(t, err)
	assert.ErrorContains(t, err, "panic refreshing ECHIMP CR and TDL cache: refresh exploded")

	var refreshCalls atomic.Int32
	errs := make(chan error, 1)
	go func() {
		errs <- cache.ensureUsableCache(viperConfig, logger, func() error {
			refreshCalls.Add(1)
			return errors.New("refresh should not be retried during cooldown after panic")
		})
	}()

	select {
	case err := <-errs:
		require.Error(t, err)
		assert.ErrorContains(t, err, "panic refreshing ECHIMP CR and TDL cache: refresh exploded")
	case <-time.After(time.Second):
		t.Fatal("ensureFresh blocked after refresh panic")
	}

	assert.Equal(t, int32(0), refreshCalls.Load())
	entries := logs.All()
	require.Len(t, entries, 2)
	assert.Equal(t, "panic refreshing ECHIMP CR and TDL cache", entries[0].Message)
	assert.Equal(t, "error refreshing ECHIMP CR and TDL cache", entries[1].Message)
}
