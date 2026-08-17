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
