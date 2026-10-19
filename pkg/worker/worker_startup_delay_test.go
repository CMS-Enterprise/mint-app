package worker

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap/zaptest"
)

func TestWaitForStartupDelay_DisabledWhenMaxIsZeroOrNegative(t *testing.T) {
	logger := zaptest.NewLogger(t)

	for _, maxDelaySeconds := range []int{0, -1} {
		start := time.Now()
		err := waitForStartupDelay(context.Background(), maxDelaySeconds, logger)
		assert.NoError(t, err)
		assert.Less(t, time.Since(start), 100*time.Millisecond)
	}
}

func TestWaitForStartupDelay_ElapsesWithinBounds(t *testing.T) {
	logger := zaptest.NewLogger(t)

	start := time.Now()
	err := waitForStartupDelay(context.Background(), 1, logger)
	elapsed := time.Since(start)

	assert.NoError(t, err)
	assert.Less(t, elapsed, 1500*time.Millisecond, "delay should be bounded by maxDelaySeconds")
}

func TestWaitForStartupDelay_ReturnsCtxErrWhenCanceledFirst(t *testing.T) {
	logger := zaptest.NewLogger(t)

	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	start := time.Now()
	err := waitForStartupDelay(ctx, 60, logger)
	elapsed := time.Since(start)

	assert.ErrorIs(t, err, context.Canceled)
	assert.Less(t, elapsed, 100*time.Millisecond, "should return immediately, not wait out the delay")
}

func TestWaitForStartupDelay_CancellationDuringDelayInterruptsWait(t *testing.T) {
	logger := zaptest.NewLogger(t)

	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		time.Sleep(50 * time.Millisecond)
		cancel()
	}()

	start := time.Now()
	err := waitForStartupDelay(ctx, 60, logger)
	elapsed := time.Since(start)

	assert.ErrorIs(t, err, context.Canceled)
	assert.Less(t, elapsed, 1*time.Second, "cancellation should interrupt the wait long before the 60s delay elapses")
}
