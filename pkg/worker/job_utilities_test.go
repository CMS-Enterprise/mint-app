package worker

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"testing"

	"github.com/stretchr/testify/assert"
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
	decoratedLogger := decorateFaktoryLoggerStandardFields(logger, jid1, jobType1, BIDZapField(bid1))

	// Trigger a log entry to populate fields
	decoratedLogger.Info("test message")

	// Capture the fields from the decorated logger
	logOutput := writeSyncer.GetBufferString()
	logMessage := map[string]interface{}{}
	err := json.Unmarshal([]byte(logOutput), &logMessage)
	assert.NoError(err)

	assert.EqualValues(faktoryLoggingSection, logMessage[appSectionKey])
	assert.EqualValues(bid1, logMessage[batchIDKey])
	assert.EqualValues(jid1, logMessage[jobIDKey])
	assert.EqualValues(jobType1, logMessage[jobTypeKey])

	t.Run("duplicated_logger_fields_overwrite", func(t *testing.T) {
		//TODO: Make this test pass, or ensure that no duplicate keys are found ever
		// zap doesn't assert field uniqueness. We have to do it ourself or accept as a possibility
		// https://github.com/uber-go/zap/issues/81#issuecomment-235629205
		bid2 := "mockBid2"
		jid2 := "mockJid2"
		jobType2 := "mockJobType2"
		writeSyncer2, logger2 := createTestLogger()
		doubleDecoratedLogger := decorateFaktoryLoggerStandardFields(decorateFaktoryLoggerStandardFields(logger2, jid1, jobType1, BIDZapField(bid1)), jid2, jobType2, BIDZapField(bid2))

		doubleDecoratedLogger.Info("test message")

		// Capture the fields from the decorated logger
		logOutput := writeSyncer2.GetBufferString()

		// Define a regex pattern to match a key and capture its value
		pattern := `"(\w+)":"([^"]+)"`
		re := regexp.MustCompile(pattern)
		// Find all matches

		seenMap := map[string]string{}
		matches := re.FindAllStringSubmatch(logOutput, -1)
		// Iterate over matches and check if the key is seen multiple times
		for _, match := range matches {
			key := match[1]
			value := match[2]

			lastSeen, wasSeen := seenMap[key]
			if assert.Falsef(wasSeen, "already saw key : %s. Previous value was %s, current value is %s", key, lastSeen, value) {
				seenMap[key] = value
			}

		}
		// TODO: Improve this, it passes just because we deserialize to a map, which squashes previous entries, zap doesn't do that, so we can have conflicts when inspecting code
		logMessage := map[string]interface{}{}
		err := json.Unmarshal([]byte(logOutput), &logMessage)
		assert.NoError(err)

		assert.EqualValues(faktoryLoggingSection, logMessage[appSectionKey])
		assert.EqualValues(bid2, logMessage[batchIDKey])
		assert.EqualValues(jid2, logMessage[jobIDKey])
		assert.EqualValues(jobType2, logMessage[jobTypeKey])
	})
}
