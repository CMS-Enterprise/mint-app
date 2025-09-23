package s3

import (
	"bytes"
	"context"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// GetS3ObjectReaderAt returns an io.ReaderAt from an S3 object
func (c S3Client) GetS3ObjectReaderAt(key string) (io.ReaderAt, int64, error) {
	// Get the S3 object
	resp, err := c.client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
	})

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get S3 object: %w", err)
	}
	defer resp.Body.Close()

	var size int64 = 0
	if resp.ContentLength != nil {
		size = *resp.ContentLength
	}

	// Read the object into memory (make sure the object is not too large for this!)
	buf := new(bytes.Buffer)
	if _, err := io.Copy(buf, resp.Body); err != nil {
		return nil, 0, fmt.Errorf("failed to read S3 object into buffer: %w", err)
	}

	// Wrap the buffer in a bytes.Reader, which implements io.ReaderAt
	return bytes.NewReader(buf.Bytes()), size, nil
}
