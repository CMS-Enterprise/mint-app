package worker

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"testing"

	faktory "github.com/contribsys/faktory/client"
	worker "github.com/contribsys/faktory_worker_go"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/cms-enterprise/mint-app/pkg/logfields"
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
	decoratedLogger := loggerWithFaktoryStandardFields(logger, jid1, jobType1, logfields.BID(bid1))

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
		doubleDecoratedLogger := loggerWithFaktoryStandardFields(loggerWithFaktoryStandardFields(logger2, jid1, jobType1, logfields.BID(bid1)), jid2, jobType2, logfields.BID(bid2))

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

// A tiny helper to decode the *last* JSON log line in the buffer.
func lastLogLine(buf string, t *testing.T) map[string]interface{} {
	t.Helper()
	lines := strings.Split(strings.TrimSpace(buf), "\n")
	require.NotEmpty(t, lines, "expected at least one log line")
	var m map[string]interface{}
	require.NoError(t, json.Unmarshal([]byte(lines[len(lines)-1]), &m))
	return m
}

func TestRetryAwareLogging_WarnsWhenRetriesRemain(t *testing.T) {
	ws, zl := createTestLogger()

	// Wire middleware into a real Manager so HelperFor(ctx) is valid.
	mgr := worker.NewManager()
	mgr.Use(RetryAwareLogging(zl))

	// Register a job that always fails.
	mgr.Register("FailingJob", func(ctx context.Context, args ...interface{}) error {
		return errors.New("boom")
	})

	// First failure: no Failure set yet -> fail_count_so_far = 0
	job := faktory.NewJob("FailingJob")

	// Execute inline (runs middleware + job)
	err := mgr.InlineDispatch(job)
	require.Error(t, err)

	out := ws.GetBufferString()
	ll := lastLogLine(out, t)

	require.Equal(t, "warn", ll["level"])
	require.Equal(t, "job failed; will retry", ll["msg"])
	require.EqualValues(t, 0, ll["fail_count_so_far"])
	require.EqualValues(t, defaultMaxRetries, ll["max_retries"])
	require.NotEmpty(t, ll["jid"])
	require.NotEmpty(t, ll["job_type"])
}

func TestRetryAwareLogging_ErrorsOnFinalAttempt_DefaultRetries(t *testing.T) {
	ws, zl := createTestLogger()

	mgr := worker.NewManager()
	mgr.Use(RetryAwareLogging(zl))
	mgr.Register("FailingJob", func(ctx context.Context, args ...interface{}) error {
		return errors.New("boom")
	})

	// Simulate we already failed `defaultMaxRetries` times BEFORE this run.
	job := faktory.NewJob("FailingJob")
	job.Failure = &faktory.Failure{RetryCount: defaultMaxRetries}

	err := mgr.InlineDispatch(job)
	require.Error(t, err)

	ll := lastLogLine(ws.GetBufferString(), t)
	require.Equal(t, "error", ll["level"])
	require.Equal(t, "job failed on final attempt; no retries remain", ll["msg"])
	require.EqualValues(t, defaultMaxRetries, ll["fail_count_so_far"])
	require.EqualValues(t, defaultMaxRetries, ll["max_retries"])
}

func TestRetryAwareLogging_RespectsPerJobRetryOverride(t *testing.T) {
	ws, zl := createTestLogger()

	mgr := worker.NewManager()
	mgr.Use(RetryAwareLogging(zl))
	mgr.Register("FailingJob", func(ctx context.Context, args ...interface{}) error {
		return errors.New("boom")
	})

	// Per-job retry override: allow only 1 retry total.
	one := 1
	job := faktory.NewJob("FailingJob")
	job.Retry = &one

	// If we've already failed once BEFORE this run, this run is final.
	job.Failure = &faktory.Failure{RetryCount: 1}

	err := mgr.InlineDispatch(job)
	require.Error(t, err)

	ll := lastLogLine(ws.GetBufferString(), t)
	require.Equal(t, "error", ll["level"])
	require.Equal(t, "job failed on final attempt; no retries remain", ll["msg"])
	require.EqualValues(t, 1, ll["fail_count_so_far"])
	require.EqualValues(t, 1, ll["max_retries"])
}

func TestRetryAwareLogging_NoLogOnSuccess(t *testing.T) {
	ws, zl := createTestLogger()
	mgr := worker.NewManager()
	mgr.Use(RetryAwareLogging(zl))
	mgr.Register("Succeeds", func(ctx context.Context, args ...interface{}) error {
		return nil
	})

	job := faktory.NewJob("Succeeds")
	err := mgr.InlineDispatch(job)
	require.NoError(t, err)

	// Middleware should not emit warn/error on success.
	require.Equal(t, "", strings.TrimSpace(ws.GetBufferString()))
}

// Optional: sanity check that helper fields are present in logs
func TestRetryAwareLogging_EmitsHelperFields(t *testing.T) {
	ws, zl := createTestLogger()
	mgr := worker.NewManager()
	mgr.Use(RetryAwareLogging(zl))
	mgr.Register("FailingJob", func(ctx context.Context, args ...interface{}) error {
		return errors.New("boom")
	})

	job := faktory.NewJob("FailingJob")
	_ = mgr.InlineDispatch(job)

	ll := lastLogLine(ws.GetBufferString(), t)
	require.NotEmpty(t, ll["jid"])
	require.NotEmpty(t, ll["job_type"])
}
