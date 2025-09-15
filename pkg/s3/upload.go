package s3

import (
	"io"
	"mime"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"

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
	client s3iface.S3API
	config Config
}

// NewS3Client creates a new s3 service client
func NewS3Client(config Config) S3Client {
	//TODO: Consider deprecating config, and replacing with parameters
	//TODO: Consider replacing the calls to os.Getenv to user viper.GetString to be consistent with the rest of the app (and remove any need to call os.SetEnv)
	awsConfig := &aws.Config{
		Region: &config.Region,
	}

	// if we are in a local dev environment we use Minio for s3
	if config.IsLocal {
		awsConfig.Endpoint = helpers.PointerTo(os.Getenv(appconfig.LocalMinioAddressKey))
		awsConfig.Credentials = credentials.NewStaticCredentials(
			os.Getenv(appconfig.LocalMinioS3AccessKey),
			os.Getenv(appconfig.LocalMinioS3SecretKey),
			"")
		awsConfig.S3ForcePathStyle = helpers.PointerTo(true)
	}

	s3Session := session.Must(session.NewSession(awsConfig))

	return NewS3ClientUsingClient(s3.New(s3Session), config)
}

// NewS3ClientUsingClient creates a new s3 wrapper using the specified s3 client
// This is most useful for testing where the s3 client needs to be mocked out.
func NewS3ClientUsingClient(s3Client s3iface.S3API, config Config) S3Client {
	return S3Client{
		s3Client,
		config,
	}
}

// NewPutPresignedURL returns a pre-signed URL used for PUT-ing objects
func (c S3Client) NewPutPresignedURL(fileType string) (*models.PreSignedURL, error) {
	// generate a uuid for file name storage on s3
	key := uuid.New().String()

	// get the file extension from the mime type
	extensions, err := mime.ExtensionsByType(fileType)
	if err != nil {
		return &models.PreSignedURL{}, err
	}
	if len(extensions) > 0 {
		key = key + extensions[0]
	}
	req, _ := c.client.PutObjectRequest(&s3.PutObjectInput{
		Bucket:      &c.config.Bucket,
		Key:         &key,
		ContentType: &fileType,
	})

	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		return &models.PreSignedURL{}, err
	}

	result := models.PreSignedURL{URL: url, Filename: key}

	return &result, nil
}

// NewGetPresignedURL returns a pre-signed URL used for GET-ing objects
func (c S3Client) NewGetPresignedURL(key string) (*string, error) {
	objectInput := &s3.GetObjectInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
	}
	req, _ := c.client.GetObjectRequest(objectInput)

	url, err := req.Presign(PresignedKeyDuration)
	if err != nil {
		return nil, err
	}

	return &url, nil

}

// KeyFromURL extracts an S3 key from a URL.
func (c S3Client) KeyFromURL(url *url.URL) (string, error) {
	return strings.Replace(url.Path, "/"+c.config.Bucket+"/", "", 1), nil
}

// TagValueForKey returns the tag value and if that tag was found for the
// specified key and tag name. If no value is found, returns an empty string.
func (c S3Client) TagValueForKey(key string, tagName string) (string, error) {
	input := &s3.GetObjectTaggingInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
	}
	tagging, taggingErr := c.client.GetObjectTagging(input)
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
func (c S3Client) SetTagValueForKey(key string, tagName string, tagValue string) error {
	input := &s3.PutObjectTaggingInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
		Tagging: &s3.Tagging{
			TagSet: []*s3.Tag{
				{
					Key:   &tagName,
					Value: &tagValue,
				},
			},
		},
	}
	_, taggingErr := c.client.PutObjectTagging(input)
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
func (c S3Client) UploadFile(file io.Reader, key string) error {
	uploader := s3manager.NewUploaderWithClient(c.client)

	_, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
		Body:   file,
	})
	if err != nil {
		return err
	}

	return nil
}
