package worker

import (
	"context"
	"fmt"
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
