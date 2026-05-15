package s3

import (
	"context"
	"fmt"
	"io"

	s3New "github.com/aws/aws-sdk-go-v2/service/s3"
)

// withCredentialRefresh is the default wrapper for single-attempt S3
// operations that are safe to retry once after rebuilding the AWS client.
func withCredentialRefresh[T any](ctx context.Context, client *S3Client, operation func(*s3New.Client) (T, error)) (T, error) {
	return withCredentialRefreshAndBuilder(ctx, client, buildClient, operation)
}

// withCredentialRefreshAndBuilder is the generic retry implementation behind
// withCredentialRefresh. Callers use this variant when they need to swap in a
// test builder or otherwise control how the refreshed AWS client is created.
func withCredentialRefreshAndBuilder[T any](ctx context.Context, client *S3Client, builder clientBuilder, operation func(*s3New.Client) (T, error)) (T, error) {
	initialClient := client.currentClient()
	result, err := operation(initialClient)
	if err == nil {
		return result, nil
	}

	var zero T
	if !S3ErrorHasExpiredCredentials(err) {
		return zero, err
	}

	if refreshErr := client.refreshWithBuilder(ctx, builder, initialClient); refreshErr != nil {
		return zero, fmt.Errorf("failed to refresh S3 client after expired credentials: %w", refreshErr)
	}

	result, err = operation(client.currentClient())
	if err != nil {
		return zero, fmt.Errorf("s3 operation failed after credential refresh: %w", err)
	}

	return result, nil
}

// withCredentialRefreshAndRewind is the upload-oriented variant for operations
// whose bodies must be rewound to the caller's starting offset before a retry.
func withCredentialRefreshAndRewind[T any](ctx context.Context, client *S3Client, builder clientBuilder, body io.ReadSeeker, operation func(*s3New.Client, io.Reader) (T, error)) (T, error) {
	// Capture the starting offset before the first attempt so we can rewind to
	// the caller's original position if we need a credential-refresh retry.
	startOffset, startOffsetErr := body.Seek(0, io.SeekCurrent)

	initialClient := client.currentClient()
	result, err := operation(initialClient, body)
	if err == nil {
		return result, nil
	}

	var zero T
	if !S3ErrorHasExpiredCredentials(err) {
		return zero, err
	}

	// A failed offset capture does not block the first upload attempt; it only
	// becomes fatal once we know we need to rewind for a retry.
	if startOffsetErr != nil {
		return zero, fmt.Errorf("failed to capture upload reader position for retry: %w", startOffsetErr)
	}

	if refreshErr := client.refreshWithBuilder(ctx, builder, initialClient); refreshErr != nil {
		return zero, fmt.Errorf("failed to refresh S3 client after expired credentials: %w", refreshErr)
	}

	if _, seekErr := body.Seek(startOffset, io.SeekStart); seekErr != nil {
		return zero, fmt.Errorf("failed to rewind upload reader after credential refresh: %w", seekErr)
	}

	result, err = operation(client.currentClient(), body)
	if err != nil {
		return zero, fmt.Errorf("s3 upload failed after credential refresh: %w", err)
	}

	return result, nil
}
