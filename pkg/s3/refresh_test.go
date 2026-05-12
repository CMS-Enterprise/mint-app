package s3

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"github.com/aws/smithy-go"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
)

func TestRefreshRebuildsClient(t *testing.T) {
	t.Setenv(appconfig.LocalMinioAddressKey, "http://localhost:9000")
	t.Setenv(appconfig.LocalMinioS3AccessKey, "test-access-key")
	t.Setenv(appconfig.LocalMinioS3SecretKey, "test-secret-key")

	client := NewS3ClientUsingClient(nil, Config{
		Bucket:  "test-bucket",
		Region:  "us-west-2",
		IsLocal: true,
	})

	require.Nil(t, client.currentClient())
	require.NoError(t, client.Refresh(context.Background()))
	assert.NotNil(t, client.currentClient())
}

func TestS3ErrorHasExpiredCredentials(t *testing.T) {
	t.Parallel()

	assert.False(t, S3ErrorHasExpiredCredentials(nil))
	assert.True(t, S3ErrorHasExpiredCredentials(&smithy.GenericAPIError{Code: "InvalidToken", Message: "invalid token"}))
	assert.True(t, S3ErrorHasExpiredCredentials(fmt.Errorf("request failed: %w", &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"})))
	assert.True(t, S3ErrorHasExpiredCredentials(errors.New("ExpiredToken: security token included in the request is expired")))
	assert.False(t, S3ErrorHasExpiredCredentials(&smithy.GenericAPIError{Code: "AccessDenied", Message: "denied"}))
}
