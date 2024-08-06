// Package logutilities provides some conveniences methods for logging
package logutilities

import (
	"fmt"

	"go.uber.org/zap"
)

// WrapAndLogError takes an error message and wraps an error message after it.
// It will also log a message to the error level with the provided logger.
func WrapAndLogError(logger *zap.Logger, errMessage string, err error) error {
	logger.Error(errMessage, zap.Error(err))
	return fmt.Errorf(errMessage+" err: %w", err)
}
