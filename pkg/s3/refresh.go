package s3

import (
	"context"

	s3New "github.com/aws/aws-sdk-go-v2/service/s3"
)

func (c *S3Client) currentClient() *s3New.Client {
	c.clientMu.RLock()
	defer c.clientMu.RUnlock()

	return c.client
}

// Refresh rebuilds the underlying AWS client using the S3 client's stored config.
func (c *S3Client) Refresh(ctx context.Context) error {
	c.refreshMu.Lock()
	defer c.refreshMu.Unlock()

	client, err := buildClient(ctx, c.config)
	if err != nil {
		return err
	}

	c.clientMu.Lock()
	c.client = client
	c.clientMu.Unlock()

	return nil
}
