// Package logutilities provides some conveniences methods for logging
package logutilities

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestWrapAndLogError(t *testing.T) {

	assert := assert.New(t)
	syncer, logger := createTestLogger()

	err0 := fmt.Errorf("this is an error")

	errMessage1 := "err 1  message"
	errMessage2 := "err 2  message"
	errMessage3 := "err 3  message"
	errMessage4 := "err 4  message"
	err1 := WrapAndLogError(logger, errMessage1, err0)
	err2 := WrapAndLogError(logger, errMessage2, err1)
	err3 := WrapAndLogError(logger, errMessage3, err2)
	err4 := WrapAndLogError(logger, errMessage4, err3)

	finalErr4String := err4.Error()
	assert.NotNil(finalErr4String)

	finalErrLogStream := syncer.GetBufferString()

	assert.NotNil(finalErrLogStream)
}
