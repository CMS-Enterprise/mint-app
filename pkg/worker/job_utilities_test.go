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
