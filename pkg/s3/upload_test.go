package s3

import (
	"bytes"
	"context"
	"errors"
	"io"
	"testing"

	s3New "github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type failingReadSeeker struct {
	data       []byte
	pos        int64
	failRewind bool
}

func (r *failingReadSeeker) Read(p []byte) (int, error) {
	if r.pos >= int64(len(r.data)) {
		return 0, io.EOF
	}

	n := copy(p, r.data[r.pos:])
	r.pos += int64(n)
	return n, nil
}

func (r *failingReadSeeker) Seek(offset int64, whence int) (int64, error) {
	var next int64

	switch whence {
	case io.SeekStart:
		next = offset
	case io.SeekCurrent:
		next = r.pos + offset
	case io.SeekEnd:
		next = int64(len(r.data)) + offset
	default:
		return 0, errors.New("invalid whence")
	}

	if next < 0 {
		return 0, errors.New("negative position")
	}
	if r.failRewind && whence == io.SeekStart {
		return 0, errors.New("rewind failed")
	}

	r.pos = next
	return r.pos, nil
}

func TestUploadFileWithBuilderRetriesSeekableReaderAfterExpiredCredentials(t *testing.T) {
	t.Parallel()

	initialClient := &s3New.Client{}
	refreshedClient := &s3New.Client{}
	client := NewS3ClientUsingClient(initialClient, Config{})
	reader := bytes.NewReader([]byte("xxpayload"))
	buildCalls := 0
	uploadCalls := 0

	_, err := reader.Seek(2, io.SeekStart)
	require.NoError(t, err)

	builder := func(context.Context, Config) (*s3New.Client, error) {
		buildCalls++
		return refreshedClient, nil
	}

	err = client.uploadFileWithBuilder(context.Background(), reader, builder, func(current *s3New.Client, body io.Reader) (struct{}, error) {
		uploadCalls++
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)

		if uploadCalls == 1 {
			require.Same(t, initialClient, current)
			assert.Equal(t, "payload", string(data))
			return struct{}{}, &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
		}

		require.Same(t, refreshedClient, current)
		assert.Equal(t, "payload", string(data))
		return struct{}{}, nil
	})

	require.NoError(t, err)
	assert.Equal(t, 1, buildCalls)
	assert.Equal(t, 2, uploadCalls)
}

func TestUploadFileWithBuilderDoesNotRefreshSeekableReaderForNonCredentialErrors(t *testing.T) {
	t.Parallel()

	client := NewS3ClientUsingClient(&s3New.Client{}, Config{})
	reader := bytes.NewReader([]byte("payload"))
	uploadCalls := 0
	expectedErr := errors.New("boom")

	err := client.uploadFileWithBuilder(context.Background(), reader, func(context.Context, Config) (*s3New.Client, error) {
		t.Fatal("refresh builder should not be called for non-credential errors")
		return nil, nil
	}, func(current *s3New.Client, body io.Reader) (struct{}, error) {
		uploadCalls++
		require.NotNil(t, current)
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)
		assert.Equal(t, "payload", string(data))
		return struct{}{}, expectedErr
	})

	require.ErrorIs(t, err, expectedErr)
	assert.Equal(t, 1, uploadCalls)
}

func TestUploadFileWithBuilderReturnsRefreshErrorForSeekableReader(t *testing.T) {
	t.Parallel()

	client := NewS3ClientUsingClient(&s3New.Client{}, Config{})
	reader := bytes.NewReader([]byte("payload"))
	uploadCalls := 0
	expectedErr := errors.New("refresh failed")

	err := client.uploadFileWithBuilder(context.Background(), reader, func(context.Context, Config) (*s3New.Client, error) {
		return nil, expectedErr
	}, func(current *s3New.Client, body io.Reader) (struct{}, error) {
		uploadCalls++
		require.NotNil(t, current)
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)
		assert.Equal(t, "payload", string(data))
		return struct{}{}, &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
	})

	require.Error(t, err)
	require.ErrorIs(t, err, expectedErr)
	assert.Equal(t, 1, uploadCalls)
}

func TestUploadFileWithBuilderReturnsRewindErrorForSeekableReader(t *testing.T) {
	t.Parallel()

	initialClient := &s3New.Client{}
	refreshedClient := &s3New.Client{}
	client := NewS3ClientUsingClient(initialClient, Config{})
	reader := &failingReadSeeker{
		data:       []byte("payload"),
		failRewind: true,
	}
	buildCalls := 0
	uploadCalls := 0

	builder := func(context.Context, Config) (*s3New.Client, error) {
		buildCalls++
		return refreshedClient, nil
	}

	err := client.uploadFileWithBuilder(context.Background(), reader, builder, func(current *s3New.Client, body io.Reader) (struct{}, error) {
		uploadCalls++
		require.NotNil(t, current)
		data, readErr := io.ReadAll(body)
		require.NoError(t, readErr)
		assert.Equal(t, "payload", string(data))
		return struct{}{}, &smithy.GenericAPIError{Code: "ExpiredToken", Message: "expired"}
	})

	require.Error(t, err)
	assert.Contains(t, err.Error(), "rewind upload reader")
	assert.Equal(t, 1, buildCalls)
	assert.Equal(t, 1, uploadCalls)
}
