package worker

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap/zaptest"
)

func TestRandomStartupDelay_DisabledWhenMaxIsZeroOrNegative(t *testing.T) {
	logger := zaptest.NewLogger(t)

	for _, maxDelaySeconds := range []int{0, -1} {
		assert.Zero(t, randomStartupDelay(maxDelaySeconds, logger))
	}
}

func TestRandomStartupDelay_WithinBounds(t *testing.T) {
	logger := zaptest.NewLogger(t)
	const maxDelaySeconds = 5

	// Random draw, so sample repeatedly to shake out an out-of-range value.
	for i := 0; i < 50; i++ {
		delay := randomStartupDelay(maxDelaySeconds, logger)
		assert.GreaterOrEqual(t, delay, time.Duration(0))
		assert.Less(t, delay, time.Duration(maxDelaySeconds)*time.Second)
	}
}

func TestWaitForStartupDelay_ReturnsImmediatelyWhenDelayIsZeroOrNegative(t *testing.T) {
	for _, delay := range []time.Duration{0, -1 * time.Second} {
		start := time.Now()
		err := waitForStartupDelay(context.Background(), delay)
		assert.NoError(t, err)
		assert.Less(t, time.Since(start), 100*time.Millisecond)
	}
}

func TestWaitForStartupDelay_ElapsesNormally(t *testing.T) {
	const delay = 50 * time.Millisecond

	start := time.Now()
	err := waitForStartupDelay(context.Background(), delay)
	elapsed := time.Since(start)

	assert.NoError(t, err)
	assert.GreaterOrEqual(t, elapsed, delay)
	assert.Less(t, elapsed, delay+500*time.Millisecond)
}

func TestWaitForStartupDelay_ReturnsCtxErrWhenAlreadyCanceled(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	start := time.Now()
	err := waitForStartupDelay(ctx, time.Hour)
	elapsed := time.Since(start)

	assert.ErrorIs(t, err, context.Canceled)
	assert.Less(t, elapsed, 100*time.Millisecond, "should return immediately, not wait out the delay")
}

func TestWaitForStartupDelay_CancellationDuringDelayInterruptsWait(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		time.Sleep(50 * time.Millisecond)
		cancel()
	}()

	start := time.Now()
	err := waitForStartupDelay(ctx, time.Hour)
	elapsed := time.Since(start)

	assert.ErrorIs(t, err, context.Canceled)
	assert.Less(t, elapsed, 1*time.Second, "cancellation should interrupt the wait long before the full delay elapses")
}
