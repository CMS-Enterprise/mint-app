package apperrors

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRecoverPanicAsErrorFunction(t *testing.T) {

	panicMessage := "surprise! The function panicked"
	DeferError := func(shouldPanic bool) (retErr error) {
		defer RecoverPanicAsErrorFunction(&retErr) // Pass the pointer of retErr to the deferred function

		if shouldPanic {
			panic(panicMessage)
		}

		return retErr
	}

	t.Run("Error is returned when a function panics", func(t *testing.T) {
		err := DeferError(true)
		assert.Error(t, err)
	})

	t.Run("Error is not returned when a function doesn't panic", func(t *testing.T) {
		err2 := DeferError(false)
		assert.NoError(t, err2)
	})

}
