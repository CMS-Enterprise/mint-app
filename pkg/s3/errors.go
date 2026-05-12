package s3

import (
	"errors"
	"strings"

	"github.com/aws/smithy-go"
)

const noSuchKeyErrCode = "NoSuchKey"

var expiredCredentialErrCodes = map[string]struct{}{
	"ExpiredToken":          {},
	"ExpiredTokenException": {},
	"InvalidAccessKeyId":    {},
	"InvalidToken":          {},
	"RequestExpired":        {},
	"TokenRefreshRequired":  {},
}

// S3ErrorIsKeyNotFound parses an S3 error, and returns true if it is because the file doesn't exist
func S3ErrorIsKeyNotFound(err error) bool {
	// Unwrap the error and check if it is a RequestFailure
	if reqErr, ok := errors.AsType[smithy.APIError](err); ok {
		// Check if the error has a 404 status code (key does not exist)
		if reqErr.ErrorCode() == noSuchKeyErrCode {
			return true
		}

	}
	return false

}

// S3ErrorHasExpiredCredentials returns true when an S3 request failed because
// the request was signed with expired or otherwise invalid temporary credentials.
func S3ErrorHasExpiredCredentials(err error) bool {
	if err == nil {
		return false
	}

	if reqErr, ok := errors.AsType[smithy.APIError](err); ok {
		if _, exists := expiredCredentialErrCodes[reqErr.ErrorCode()]; exists {
			return true
		}
	}

	lowerErr := strings.ToLower(err.Error())
	return strings.Contains(lowerErr, "expiredtoken") ||
		strings.Contains(lowerErr, "expired token") ||
		strings.Contains(lowerErr, "requestexpired") ||
		strings.Contains(lowerErr, "invalidtoken") ||
		strings.Contains(lowerErr, "invalid access key id")
}
