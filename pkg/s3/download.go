package s3

import (
	"bytes"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
)

// GetS3ObjectReaderAt returns an io.ReaderAt from an S3 object
func (c S3Client) GetS3ObjectReaderAt(key string) (io.ReaderAt, int64, error) {

	// Get the object metadata to find the size
	headResp, err := c.client.HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, 0, fmt.Errorf("failed to head S3 object: %w", err)
	}
	size := aws.Int64Value(headResp.ContentLength)

	// Get the S3 object
	resp, err := c.client.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get S3 object: %w", err)
	}
	defer resp.Body.Close()

	// Read the object into memory (make sure the object is not too large for this!)
	buf := new(bytes.Buffer)
	if _, err := io.Copy(buf, resp.Body); err != nil {
		return nil, 0, fmt.Errorf("failed to read S3 object into buffer: %w", err)
	}

	// Wrap the buffer in a bytes.Reader, which implements io.ReaderAt
	return bytes.NewReader(buf.Bytes()), size, nil
}
