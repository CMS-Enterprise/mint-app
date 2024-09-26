package s3

import (
	"errors"

	"github.com/aws/aws-sdk-go/aws/awserr"
)

const noSuchKeyErrCode = "NoSuchKey"

// S3ErrorIsKeyNotFound parses an S3 error, and returns true if it is because the file doesn't exist
func S3ErrorIsKeyNotFound(err error) bool {
	var reqErr awserr.Error
	// awserr.Error

	// Unwrap the error and check if it is a RequestFailure
	if errors.As(err, &reqErr) {
		// Check if the error has a 404 status code (key does not exist)
		if reqErr.Code() == noSuchKeyErrCode {
			return true
		}

	}
	return false

}
