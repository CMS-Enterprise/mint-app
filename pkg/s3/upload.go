package s3

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	s3New "github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
)

const (
	// PresignedKeyDuration TODO: Roll this into the Config struct
	PresignedKeyDuration = 15 * time.Minute
)

// Config holds the configuration to interact with s3
type Config struct {
	Bucket         string
	Region         string
	IsLocal        bool
	ExpectNoBucket bool
}

// S3Client is an MINT s3 client wrapper
type S3Client struct {
	client *s3New.Client
	config Config
}

// NewS3Client creates a new s3 service client
func NewS3Client(ctx context.Context, s3Config Config) S3Client {
	var (
		configOpts []func(*config.LoadOptions) error
		s3Opts     []func(options *s3New.Options)
	)

	configOpts = append(configOpts, config.WithRegion(s3Config.Region))

	// if we are in a local dev environment we use Minio for s3
	if s3Config.IsLocal {
		configOpts = append(configOpts, config.WithBaseEndpoint(os.Getenv(appconfig.LocalMinioAddressKey)))
		configOpts = append(configOpts, config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				os.Getenv(appconfig.LocalMinioS3AccessKey),
				os.Getenv(appconfig.LocalMinioS3SecretKey),
				""),
		))

		s3Opts = append(s3Opts, func(options *s3New.Options) {
			options.UsePathStyle = true
		})
	}

	awsConfig, err := config.LoadDefaultConfig(ctx, configOpts...)
	if err != nil {
		panic(fmt.Errorf("problem creating aws config when creating new s3 client: %w", err))
	}

	s3Client := s3New.NewFromConfig(awsConfig, s3Opts...)

	return NewS3ClientUsingClient(s3Client, s3Config)
}

// NewS3ClientUsingClient creates a new s3 wrapper using the specified s3 client
// This is most useful for testing where the s3 client needs to be mocked out.
func NewS3ClientUsingClient(s3Client *s3New.Client, config Config) S3Client {
	return S3Client{
		client: s3Client,
		config: config,
	}
}

// NewGetPresignedURL returns a pre-signed URL used for GET-ing objects
func (c S3Client) NewGetPresignedURL(ctx context.Context, key string) (*string, error) {
	objectInput := &s3New.GetObjectInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
	}

	req, err := s3New.NewPresignClient(c.client).PresignGetObject(ctx, objectInput, func(options *s3New.PresignOptions) {
		options.Expires = PresignedKeyDuration
	})
	if err != nil {
		return nil, err
	}

	return &req.URL, nil
}

// KeyFromURL extracts an S3 key from a URL.
func (c S3Client) KeyFromURL(url *url.URL) (string, error) {
	return strings.Replace(url.Path, "/"+c.config.Bucket+"/", "", 1), nil
}

// TagValueForKey returns the tag value and if that tag was found for the
// specified key and tag name. If no value is found, returns an empty string.
func (c S3Client) TagValueForKey(ctx context.Context, key string, tagName string) (string, error) {
	input := &s3New.GetObjectTaggingInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
	}
	tagging, taggingErr := c.client.GetObjectTagging(ctx, input)
	if taggingErr != nil {
		return "", taggingErr
	}

	for _, tagSet := range tagging.TagSet {
		if *tagSet.Key == tagName {
			return *tagSet.Value, nil
		}
	}
	return "", nil
}

// SetTagValueForKey sets the tag value and returns an error if any was encountered.
func (c S3Client) SetTagValueForKey(ctx context.Context, key string, tagName string, tagValue string) error {
	input := &s3New.PutObjectTaggingInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
		Tagging: &types.Tagging{
			TagSet: []types.Tag{
				{
					Key:   &tagName,
					Value: &tagValue,
				},
			},
		},
	}
	_, taggingErr := c.client.PutObjectTagging(ctx, input)
	if taggingErr != nil {
		return taggingErr
	}

	return nil
}

// GetBucket returns a *string containing the S3 Bucket as defined by the S3Configuration
func (c S3Client) GetBucket() *string {
	return &c.config.Bucket
}

// ExpectNoBucketEnabled returns true if the S3 config's ExpectNoBucket value is set
func (c S3Client) ExpectNoBucket() bool {
	return c.config.ExpectNoBucket
}

// UploadFile uploads a io.Reader to the bucket configured in the S3Client
func (c S3Client) UploadFile(ctx context.Context, file io.Reader, key string) error {
	uploader := manager.NewUploader(c.client)

	_, err := uploader.Upload(ctx, &s3New.PutObjectInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
		Body:   file,
	})
	if err != nil {
		return err
	}

	return nil
}
