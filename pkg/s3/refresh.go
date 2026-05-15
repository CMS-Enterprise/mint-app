package s3

import (
	"context"
	"time"

	s3New "github.com/aws/aws-sdk-go-v2/service/s3"
)

const refreshCoalesceWindow = time.Second * 10

type clientBuilder func(context.Context, Config) (*s3New.Client, error)

func (c *S3Client) currentClient() *s3New.Client {
	c.clientMu.RLock()
	defer c.clientMu.RUnlock()

	return c.client
}

// Refresh rebuilds the underlying AWS client using the S3 client's stored config.
func (c *S3Client) Refresh(ctx context.Context) error {
	return c.refreshWithBuilder(ctx, buildClient, nil)
}

func (c *S3Client) refreshWithBuilder(ctx context.Context, builder clientBuilder, failedClient *s3New.Client) error {
	c.refreshMu.Lock()
	defer c.refreshMu.Unlock()

	currentClient := c.currentClient()
	// Coalesce only when a recent refresh already swapped in a different client.
	// If the client that just failed is still current, we must rebuild again.
	if currentClient != nil &&
		!c.lastRefreshAt.IsZero() &&
		time.Since(c.lastRefreshAt) < refreshCoalesceWindow &&
		currentClient != failedClient {
		return nil
	}

	client, err := builder(ctx, c.config)
	if err != nil {
		return err
	}

	// grab client lock to set client
	c.clientMu.Lock()
	c.client = client
	c.clientMu.Unlock()

	// refreshMu is already held, so it is safe to update lastRefreshAt here.
	c.lastRefreshAt = time.Now()

	return nil
}
