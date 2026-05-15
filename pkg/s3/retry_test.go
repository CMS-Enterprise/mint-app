package s3

import (
	"bytes"
	"context"
	"errors"
	"io"
	"testing"
	"time"

	s3New "github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestWithCredentialRefreshRetriesOnceAfterExpiredCredentials(t *testing.T) {
	t.Parallel()

	initialClient := &s3New.Client{}
	refreshedClient := &s3New.Client{}
	client := NewS3ClientUsingClient(initialClient, Config{})
	buildCalls := 0
	opCalls := 0

	builder := func(context.Context, Config) (*s3New.Client, error) {
		buildCalls++
		return refreshedClient, nil
	}

	result, err := withCredentialRefreshAndBuilder(context.Background(), client, builder, func(current *s3New.Client) (string, error) {
		opCalls++
		if opCalls == 1 {
			require.Same(t, initialClient, current)
			return "", &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
		}

		require.Same(t, refreshedClient, current)
		return "ok", nil
	})

	require.NoError(t, err)
	assert.Equal(t, "ok", result)
	assert.Equal(t, 1, buildCalls)
	assert.Equal(t, 2, opCalls)
}

func TestWithCredentialRefreshDoesNotRefreshForNonCredentialErrors(t *testing.T) {
	t.Parallel()

	client := NewS3ClientUsingClient(&s3New.Client{}, Config{})
	expectedErr := errors.New("boom")

	result, err := withCredentialRefreshAndBuilder(context.Background(), client, func(context.Context, Config) (*s3New.Client, error) {
		t.Fatal("refresh builder should not be called for non-credential errors")
		return nil, nil
	}, func(current *s3New.Client) (string, error) {
		require.NotNil(t, current)
		return "", expectedErr
	})

	require.ErrorIs(t, err, expectedErr)
	assert.Empty(t, result)
}

func TestWithCredentialRefreshDoesNotRefreshForInvalidAccessKeyID(t *testing.T) {
	t.Parallel()

	client := NewS3ClientUsingClient(&s3New.Client{}, Config{})
	expectedErr := &smithy.GenericAPIError{Code: "InvalidAccessKeyId", Message: "bad access key"}

	result, err := withCredentialRefreshAndBuilder(context.Background(), client, func(context.Context, Config) (*s3New.Client, error) {
		t.Fatal("refresh builder should not be called for InvalidAccessKeyId")
		return nil, nil
	}, func(current *s3New.Client) (string, error) {
		require.NotNil(t, current)
		return "", expectedErr
	})

	require.ErrorIs(t, err, expectedErr)
	assert.Empty(t, result)
}

func TestWithCredentialRefreshRebuildsWhenFailedClientIsStillCurrent(t *testing.T) {
	t.Parallel()

	initialClient := &s3New.Client{}
	refreshedClient := &s3New.Client{}
	client := NewS3ClientUsingClient(initialClient, Config{})
	client.lastRefreshAt = time.Now()

	buildCalls := 0
	opCalls := 0

	builder := func(context.Context, Config) (*s3New.Client, error) {
		buildCalls++
		return refreshedClient, nil
	}

	result, err := withCredentialRefreshAndBuilder(context.Background(), client, builder, func(current *s3New.Client) (string, error) {
		opCalls++
		if opCalls == 1 {
			require.Same(t, initialClient, current)
			return "", &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
		}

		require.Same(t, refreshedClient, current)
		return "ok", nil
	})

	require.NoError(t, err)
	assert.Equal(t, "ok", result)
	assert.Equal(t, 1, buildCalls)
	assert.Equal(t, 2, opCalls)
	assert.Same(t, refreshedClient, client.currentClient())
}

func TestWithCredentialRefreshUsesNewerInstalledClientWithoutRebuilding(t *testing.T) {
	t.Parallel()

	initialClient := &s3New.Client{}
	newerClient := &s3New.Client{}
	client := NewS3ClientUsingClient(initialClient, Config{})

	buildCalls := 0
	opCalls := 0

	builder := func(context.Context, Config) (*s3New.Client, error) {
		buildCalls++
		return &s3New.Client{}, nil
	}

	result, err := withCredentialRefreshAndBuilder(context.Background(), client, builder, func(current *s3New.Client) (string, error) {
		opCalls++
		if opCalls == 1 {
			require.Same(t, initialClient, current)

			client.clientMu.Lock()
			client.client = newerClient
			client.clientMu.Unlock()
			client.lastRefreshAt = time.Now()

			return "", &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
		}

		require.Same(t, newerClient, current)
		return "ok", nil
	})

	require.NoError(t, err)
	assert.Equal(t, "ok", result)
	assert.Equal(t, 0, buildCalls)
	assert.Equal(t, 2, opCalls)
	assert.Same(t, newerClient, client.currentClient())
}

func TestWithCredentialRefreshAndRewindRetriesSeekableReaderOnce(t *testing.T) {
	t.Parallel()

	initialClient := &s3New.Client{}
	refreshedClient := &s3New.Client{}
	client := NewS3ClientUsingClient(initialClient, Config{})
	buildCalls := 0
	opCalls := 0
	reader := bytes.NewReader([]byte("xxpayload"))

	_, err := reader.Seek(2, io.SeekStart)
	require.NoError(t, err)

	builder := func(context.Context, Config) (*s3New.Client, error) {
		buildCalls++
		return refreshedClient, nil
	}

	result, err := withCredentialRefreshAndRewind(context.Background(), client, builder, reader, func(current *s3New.Client, body io.Reader) (string, error) {
		opCalls++
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)

		if opCalls == 1 {
			require.Same(t, initialClient, current)
			assert.Equal(t, "payload", string(data))
			return "", &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
		}

		require.Same(t, refreshedClient, current)
		assert.Equal(t, "payload", string(data))
		return "ok", nil
	})

	require.NoError(t, err)
	assert.Equal(t, "ok", result)
	assert.Equal(t, 1, buildCalls)
	assert.Equal(t, 2, opCalls)
}

func TestWithCredentialRefreshAndRewindDoesNotRefreshForNonCredentialErrors(t *testing.T) {
	t.Parallel()

	client := NewS3ClientUsingClient(&s3New.Client{}, Config{})
	reader := bytes.NewReader([]byte("payload"))
	expectedErr := errors.New("boom")

	result, err := withCredentialRefreshAndRewind(context.Background(), client, func(context.Context, Config) (*s3New.Client, error) {
		t.Fatal("refresh builder should not be called for non-credential errors")
		return nil, nil
	}, reader, func(current *s3New.Client, body io.Reader) (string, error) {
		require.NotNil(t, current)
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)
		assert.Equal(t, "payload", string(data))
		return "", expectedErr
	})

	require.ErrorIs(t, err, expectedErr)
	assert.Empty(t, result)
}

func TestWithCredentialRefreshAndRewindAllowsInitialUploadWhenOffsetCaptureFails(t *testing.T) {
	t.Parallel()

	client := NewS3ClientUsingClient(&s3New.Client{}, Config{})
	reader := &failingReadSeeker{
		data:        []byte("payload"),
		failCurrent: true,
	}
	opCalls := 0

	result, err := withCredentialRefreshAndRewind(context.Background(), client, func(context.Context, Config) (*s3New.Client, error) {
		t.Fatal("refresh builder should not be called when the first upload succeeds")
		return nil, nil
	}, reader, func(current *s3New.Client, body io.Reader) (string, error) {
		opCalls++
		require.NotNil(t, current)
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)
		assert.Equal(t, "payload", string(data))
		return "ok", nil
	})

	require.NoError(t, err)
	assert.Equal(t, "ok", result)
	assert.Equal(t, 1, opCalls)
}

func TestWithCredentialRefreshAndRewindReturnsCaptureErrorOnlyWhenRetryNeeded(t *testing.T) {
	t.Parallel()

	client := NewS3ClientUsingClient(&s3New.Client{}, Config{})
	reader := &failingReadSeeker{
		data:        []byte("payload"),
		failCurrent: true,
	}
	opCalls := 0

	result, err := withCredentialRefreshAndRewind(context.Background(), client, func(context.Context, Config) (*s3New.Client, error) {
		t.Fatal("refresh builder should not be called when the retry cannot rewind")
		return nil, nil
	}, reader, func(current *s3New.Client, body io.Reader) (string, error) {
		opCalls++
		require.NotNil(t, current)
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)
		assert.Equal(t, "payload", string(data))
		return "", &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
	})

	require.Error(t, err)
	assert.ErrorContains(t, err, "failed to capture upload reader position for retry")
	assert.Empty(t, result)
	assert.Equal(t, 1, opCalls)
}
