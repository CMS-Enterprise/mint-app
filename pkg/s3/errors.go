package s3

import (
	"errors"

	"github.com/aws/smithy-go"
)

const noSuchKeyErrCode = "NoSuchKey"

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
