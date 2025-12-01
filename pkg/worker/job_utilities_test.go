package worker

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/logfields"

	faktory "github.com/contribsys/faktory/client"
)

func TestJobWithPanicProtection(t *testing.T) {
	panicMessage := "panic Time!"
	panicFunc := func(ctx context.Context, args ...interface{}) (returnedError error) {
		panic(panicMessage)
	}

	t.Run("Error is returned when a job panics", func(t *testing.T) {
		funcToTest := JobWithPanicProtection(panicFunc)
		err := funcToTest(nil, nil)
		assert.Error(t, err)
		expectedError := fmt.Sprintf("recovered from panic. Error: %s", panicMessage)
		assert.EqualValues(t, expectedError, err.Error())
	})
	t.Run("Error is logged when a job panics", func(t *testing.T) {
		// Create test logger to capture log output
		writeSyncer, logger := createTestLogger()

		// Create a context with the logger
		ctx := appcontext.WithLogger(context.Background(), logger)

		// Wrap with panic protection
		protectedFunc := JobWithPanicProtection(panicFunc)

		// Execute the protected function
		err := protectedFunc(ctx, nil)

		// Assert error was returned
		assert.Error(t, err)
		expectedError := fmt.Sprintf("recovered from panic. Error: %s", panicMessage)
		assert.EqualValues(t, expectedError, err.Error())

		// Get log output and verify error was logged
		logOutput := writeSyncer.GetBufferString()
		logMessage := map[string]interface{}{}
		jsonErr := json.Unmarshal([]byte(logOutput), &logMessage)
		assert.NoError(t, jsonErr)

		// Verify the error log entry
		assert.EqualValues(t, "error", logMessage["level"])
		assert.EqualValues(t, "job panic recovered", logMessage["msg"])
		assert.Contains(t, logMessage["error"], panicMessage)

	})

}

func TestDecorateFaktoryLoggerStandardFields(t *testing.T) {
	// Create a mock helper with predefined values

	bid1 := "mockBid"
	jid1 := "mockJid"
	jobType1 := "mockJobType"

	assert := assert.New(t)

	// Create a zap test logger
	// logger := zaptest.NewLogger(t)
	writeSyncer, logger := createTestLogger()

	// Call the function under test
	decoratedLogger := loggerWithFaktoryStandardFields(logger, jid1, jobType1, &bid1)

	// Trigger a log entry to populate fields
	decoratedLogger.Info("test message")

	// Capture the fields from the decorated logger
	logOutput := writeSyncer.GetBufferString()
	logMessage := map[string]interface{}{}
	err := json.Unmarshal([]byte(logOutput), &logMessage)
	assert.NoError(err)

	assert.EqualValues(logfields.FaktorySectionKey, logMessage[logfields.AppSectionKey])
	assert.EqualValues(bid1, logMessage[logfields.BatchIDKey])
	assert.EqualValues(jid1, logMessage[logfields.JobIDKey])
	assert.EqualValues(jobType1, logMessage[logfields.JobTypeKey])
	assert.EqualValues(jobType1, logMessage[logfields.JobTypeKey])

	trace := logMessage[logfields.TraceFieldKey]

	assert.NotNil(trace)
	assert.IsType("string", trace)

	t.Run("duplicated_logger_fields_are_not_overwritten", func(t *testing.T) {

		// zap doesn't assert field uniqueness. We have to do it ourself or accept as a possibility
		// https://github.com/uber-go/zap/issues/81#issuecomment-235629205
		bid2 := "mockBid2"
		jid2 := "mockJid2"
		jobType2 := "mockJobType2"
		writeSyncer2, logger2 := createTestLogger()
		doubleDecoratedLogger := loggerWithFaktoryStandardFields(loggerWithFaktoryStandardFields(logger2, jid1, jobType1, &bid1), jid2, jobType2, &bid2)

		doubleDecoratedLogger.Info("test message")

		// Capture the fields from the decorated logger
		logOutput := writeSyncer2.GetBufferString()

		// Define a regex pattern to match a key and capture its value
		pattern := `"(\w+)":"([^"]+)"`
		re := regexp.MustCompile(pattern)
		// Find all matches

		seenTwiceMap := map[string]*bool{}
		matches := re.FindAllStringSubmatch(logOutput, -1)
		// Iterate over matches and check if the key is seen multiple times
		seenTrue := true
		seenFalse := false
		for _, match := range matches {
			key := match[1]
			// value := match[2]

			_, wasSeen := seenTwiceMap[key]
			if wasSeen {
				seenTwiceMap[key] = &seenTrue
			} else {
				seenTwiceMap[key] = &seenFalse
			}

		}
		for key, value := range seenTwiceMap {
			// skip these fields provided straight from zap, we only care about additionally decorated fields
			if key == "level" || key == "msg" {
				continue
			}
			if assert.NotNil(value) {
				assert.Truef(*value, "key: %s did not have it's value seen twice as expected", key)
			}

		}

	})
}
func TestFaktoryLoggerMiddleware(t *testing.T) {
	defaultMaxRetries := 25 // Match the constant from job_utilities.go

	t.Run("extracts job information correctly", func(t *testing.T) {
		writeSyncer, logger := createTestLogger()
		ctx := appcontext.WithLogger(context.Background(), logger)

		jid := "test-jid-123"
		jobType := "TestJob"
		batchID := "batch-456"
		queue := "default"
		retryCount := 2
		maxRetries := 10

		job := &faktory.Job{
			Jid:   jid,
			Type:  jobType,
			Queue: queue,
			Retry: &maxRetries,
			Failure: &faktory.Failure{
				RetryCount: retryCount,
			},
			Custom: map[string]interface{}{
				"bid": batchID,
			},
		}

		middleware := FaktoryLoggerMiddleware()
		var capturedCtx context.Context
		nextFunc := func(ctx context.Context) error {
			capturedCtx = ctx
			faktoryLogger := FaktoryLoggerFromContext(ctx)
			faktoryLogger.Info("test message")
			return nil
		}

		err := middleware(ctx, job, nextFunc)
		assert.NoError(t, err)

		// Verify FaktoryLogger was added to context
		faktoryLogger := FaktoryLoggerFromContext(capturedCtx)
		assert.NotNil(t, faktoryLogger)
		assert.Equal(t, jid, faktoryLogger.JobID)
		assert.Equal(t, jobType, faktoryLogger.JobType)
		assert.NotNil(t, faktoryLogger.BatchID)
		assert.Equal(t, batchID, *faktoryLogger.BatchID)
		assert.Equal(t, retryCount, faktoryLogger.RetryCount)
		assert.Equal(t, maxRetries, faktoryLogger.MaxRetries)
		assert.Equal(t, queue, faktoryLogger.FaktoryQueue)

		// Verify log output
		logOutput := writeSyncer.GetBufferString()
		logMessage := map[string]interface{}{}
		jsonErr := json.Unmarshal([]byte(logOutput), &logMessage)
		assert.NoError(t, jsonErr)
		assert.Equal(t, jid, logMessage[logfields.JobIDKey])
		assert.Equal(t, jobType, logMessage[logfields.JobTypeKey])
		assert.Equal(t, batchID, logMessage[logfields.BatchIDKey])
	})

	t.Run("handles missing BatchID", func(t *testing.T) {
		writeSyncer, logger := createTestLogger()
		ctx := appcontext.WithLogger(context.Background(), logger)

		job := &faktory.Job{
			Jid:    "test-jid-no-batch",
			Type:   "TestJob",
			Queue:  "default",
			Custom: map[string]interface{}{},
		}

		middleware := FaktoryLoggerMiddleware()
		var capturedCtx context.Context
		nextFunc := func(ctx context.Context) error {
			capturedCtx = ctx
			faktoryLogger := FaktoryLoggerFromContext(ctx)
			faktoryLogger.Info("test message")
			return nil
		}

		err := middleware(ctx, job, nextFunc)
		assert.NoError(t, err)

		faktoryLogger := FaktoryLoggerFromContext(capturedCtx)
		assert.Nil(t, faktoryLogger.BatchID)

		// Verify BatchID is not in log output
		logOutput := writeSyncer.GetBufferString()
		logMessage := map[string]interface{}{}
		jsonErr := json.Unmarshal([]byte(logOutput), &logMessage)
		assert.NoError(t, jsonErr)
		_, hasBatchID := logMessage[logfields.BatchIDKey]
		assert.False(t, hasBatchID)
	})

	t.Run("handles empty string BatchID", func(t *testing.T) {
		_, logger := createTestLogger()
		ctx := appcontext.WithLogger(context.Background(), logger)

		job := &faktory.Job{
			Jid:   "test-jid",
			Type:  "TestJob",
			Queue: "default",
			Custom: map[string]interface{}{
				"bid": "",
			},
		}

		middleware := FaktoryLoggerMiddleware()
		var capturedCtx context.Context
		nextFunc := func(ctx context.Context) error {
			capturedCtx = ctx
			return nil
		}

		err := middleware(ctx, job, nextFunc)
		assert.NoError(t, err)

		faktoryLogger := FaktoryLoggerFromContext(capturedCtx)
		assert.Nil(t, faktoryLogger.BatchID)
	})
	t.Run("uses defaultMaxRetries when job.Retry is nil", func(t *testing.T) {
		_, logger := createTestLogger()
		ctx := appcontext.WithLogger(context.Background(), logger)

		job := &faktory.Job{
			Jid:   "test-jid",
			Type:  "TestJob",
			Queue: "default",
			Retry: nil,
		}

		middleware := FaktoryLoggerMiddleware()
		var capturedCtx context.Context
		nextFunc := func(ctx context.Context) error {
			capturedCtx = ctx
			return nil
		}

		err := middleware(ctx, job, nextFunc)
		assert.NoError(t, err)

		faktoryLogger := FaktoryLoggerFromContext(capturedCtx)
		assert.Equal(t, defaultMaxRetries, faktoryLogger.MaxRetries)
	})
	t.Run("handles nil job.Failure", func(t *testing.T) {
		_, logger := createTestLogger()
		ctx := appcontext.WithLogger(context.Background(), logger)

		job := &faktory.Job{
			Jid:     "test-jid",
			Type:    "TestJob",
			Queue:   "default",
			Failure: nil,
		}

		middleware := FaktoryLoggerMiddleware()
		var capturedCtx context.Context
		nextFunc := func(ctx context.Context) error {
			capturedCtx = ctx
			return nil
		}

		err := middleware(ctx, job, nextFunc)
		assert.NoError(t, err)

		faktoryLogger := FaktoryLoggerFromContext(capturedCtx)
		assert.Equal(t, 0, faktoryLogger.RetryCount)
	})
	t.Run("propagates errors from next handler", func(t *testing.T) {
		_, logger := createTestLogger()
		ctx := appcontext.WithLogger(context.Background(), logger)

		job := &faktory.Job{
			Jid:   "test-jid",
			Type:  "TestJob",
			Queue: "default",
		}

		expectedErr := fmt.Errorf("job execution failed")
		middleware := FaktoryLoggerMiddleware()
		nextFunc := func(ctx context.Context) error {
			return expectedErr
		}

		err := middleware(ctx, job, nextFunc)
		assert.Equal(t, expectedErr, err)
	})
	t.Run("returns nil when next handler succeeds", func(t *testing.T) {
		_, logger := createTestLogger()
		ctx := appcontext.WithLogger(context.Background(), logger)

		job := &faktory.Job{
			Jid:   "test-jid",
			Type:  "TestJob",
			Queue: "default",
		}

		middleware := FaktoryLoggerMiddleware()
		nextFunc := func(ctx context.Context) error {
			return nil
		}

		err := middleware(ctx, job, nextFunc)
		assert.NoError(t, err)
	})
}
