package worker

import (
	"context"
	"os"
	"syscall"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestWorkerShutdownContextCancelsOnSIGTERM(t *testing.T) {
	ctx, stop := workerShutdownContext(context.Background())
	defer stop()

	done := make(chan struct{})
	go func() {
		<-ctx.Done()
		close(done)
	}()

	proc, err := os.FindProcess(os.Getpid())
	require.NoError(t, err)
	require.NoError(t, proc.Signal(syscall.SIGTERM))

	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("context was not canceled after SIGTERM")
	}
}

func TestWaitForStartupDelayReturnsAfterDelay(t *testing.T) {
	start := time.Now()

	require.NoError(t, waitForStartupDelay(context.Background(), 10*time.Millisecond))
	require.GreaterOrEqual(t, time.Since(start), 10*time.Millisecond)
}

func TestWaitForStartupDelayStopsWhenContextIsCanceled(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	require.ErrorIs(t, waitForStartupDelay(ctx, time.Hour), context.Canceled)
}
