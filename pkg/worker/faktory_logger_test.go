package worker

import (
	"testing"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"go.uber.org/zap/zaptest/observer"

	"github.com/cms-enterprise/mint-app/pkg/logging"
)

func TestFaktoryLogger_IsFinalAttempt(t *testing.T) {
	tests := []struct {
		name       string
		retryCount int
		maxRetries int
		want       bool
	}{
		{
			name:       "first attempt with maxRetries 1",
			retryCount: 0,
			maxRetries: 1,
			want:       true,
		},
		{
			name:       "first attempt with maxRetries 2",
			retryCount: 0,
			maxRetries: 2,
			want:       false,
		},
		{
			name:       "second attempt with maxRetries 2",
			retryCount: 1,
			maxRetries: 2,
			want:       true,
		},
		{
			name:       "first attempt with maxRetries 3",
			retryCount: 0,
			maxRetries: 3,
			want:       false,
		},
		{
			name:       "second attempt with maxRetries 3",
			retryCount: 1,
			maxRetries: 3,
			want:       false,
		},
		{
			name:       "third attempt with maxRetries 3",
			retryCount: 2,
			maxRetries: 3,
			want:       true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			logger := &FaktoryLogger{
				jobInfo: jobInfo{
					RetryCount: tt.retryCount,
					MaxRetries: tt.maxRetries,
				},
			}
			if got := logger.IsFinalAttempt(); got != tt.want {
				t.Errorf("IsFinalAttempt() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestFaktoryLogger_ErrorOrWarn_FinalAttempt(t *testing.T) {
	core, logs := observer.New(zapcore.DebugLevel)
	logger := NewFaktoryLogger(zap.New(core))
	logger.RetryCount = 1
	logger.MaxRetries = 2

	logger.ErrorOrWarn("test message", zap.String("key", "value"))

	if logs.Len() != 1 {
		t.Fatalf("expected 1 log entry, got %d", logs.Len())
	}
	entry := logs.All()[0]
	if entry.Level != zapcore.ErrorLevel {
		t.Errorf("expected Error level, got %v", entry.Level)
	}
	if entry.Message != "test message" {
		t.Errorf("expected 'test message', got %q", entry.Message)
	}
}

func TestFaktoryLogger_ErrorOrWarn_NonFinalAttempt(t *testing.T) {
	core, logs := observer.New(zapcore.DebugLevel)
	logger := NewFaktoryLogger(zap.New(core))
	logger.RetryCount = 0
	logger.MaxRetries = 2

	logger.ErrorOrWarn("test message", zap.String("key", "value"))

	if logs.Len() != 1 {
		t.Fatalf("expected 1 log entry, got %d", logs.Len())
	}
	entry := logs.All()[0]
	if entry.Level != zapcore.WarnLevel {
		t.Errorf("expected Warn level, got %v", entry.Level)
	}
	if entry.Message != "test message" {
		t.Errorf("expected 'test message', got %q", entry.Message)
	}
}

func TestFaktoryLogger_DecorateWithJobInfo(t *testing.T) {
	core, logs := observer.New(zapcore.DebugLevel)
	logger := NewFaktoryLogger(zap.New(core))
	batchID := "batch-123"
	logger.JobID = "job-456"
	logger.JobType = "email_job"
	logger.BatchID = &batchID
	logger.RetryCount = 1
	logger.MaxRetries = 3
	logger.FaktoryQueue = "critical"

	decoratedLogger := logger.DecorateWithJobInfo()
	decoratedLogger.Info("test message")

	if logs.Len() != 1 {
		t.Fatalf("expected 1 log entry, got %d", logs.Len())
	}

	entry := logs.All()[0]
	contextMap := entry.ContextMap()

	if contextMap["job_id"] != "job-456" {
		t.Errorf("expected job_id 'job-456', got %v", contextMap["job_id"])
	}
	if contextMap["job_type"] != "email_job" {
		t.Errorf("expected job_type 'email_job', got %v", contextMap["job_type"])
	}
	if contextMap["batch_id"] != "batch-123" {
		t.Errorf("expected batch_id 'batch-123', got %v", contextMap["batch_id"])
	}
	if contextMap["retry_count"] != int64(1) {
		t.Errorf("expected retry_count 1, got %v", contextMap["retry_count"])
	}
	if contextMap["max_retries"] != int64(3) {
		t.Errorf("expected max_retries 3, got %v", contextMap["max_retries"])
	}
	if contextMap["is_final_attempt"] != false {
		t.Errorf("expected is_final_attempt false, got %v", contextMap["is_final_attempt"])
	}
	if contextMap["faktory_queue"] != "critical" {
		t.Errorf("expected faktory_queue 'critical', got %v", contextMap["faktory_queue"])
	}
}

func TestFaktoryLogger_Named_ReturnsCorrectType(t *testing.T) {
	core, _ := observer.New(zapcore.DebugLevel)
	logger := NewFaktoryLogger(zap.New(core))

	result := logger.Named("test")

	if result == nil {
		t.Fatal("expected Named to return non-nil logger")
	}
	if result != logger {
		t.Error("expected Named to return the same FaktoryLogger instance")
	}
}

func TestFaktoryLogger_WithOptions_ReturnsCorrectType(t *testing.T) {
	core, _ := observer.New(zapcore.DebugLevel)
	logger := NewFaktoryLogger(zap.New(core))

	result := logger.WithOptions(zap.AddCaller())

	if result == nil {
		t.Fatal("expected WithOptions to return non-nil logger")
	}
	if result != logger {
		t.Error("expected WithOptions to return the same FaktoryLogger instance")
	}
}

func TestFaktoryLogger_With_ReturnsCorrectType(t *testing.T) {
	core, _ := observer.New(zapcore.DebugLevel)
	logger := NewFaktoryLogger(zap.New(core))

	result := logger.With(zap.String("key", "value"))

	if result == nil {
		t.Fatal("expected With to return non-nil logger")
	}
	if result != logger {
		t.Error("expected With to return the same FaktoryLogger instance")
	}
}

func TestFaktoryLogger_InterfaceCompliance(t *testing.T) {
	core, _ := observer.New(zapcore.DebugLevel)
	logger := NewFaktoryLogger(zap.New(core))

	var _ logging.ILogger = logger
	var _ logging.ChainableLogger[*FaktoryLogger] = logger
	var _ logging.ErrorOrWarnLogger = logger
	var _ logging.ChainableErrorOrWarnLogger[*FaktoryLogger] = logger
}
