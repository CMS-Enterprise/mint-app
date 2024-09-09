// Package s3testconfigs is a utility package that allows us to easily configure test S3 clients
package s3testconfigs

import (
	"os"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/s3"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
)

// S3TestClient returns an S3Test client for testing
func S3TestClient() s3.S3Client {
	config := testhelpers.NewConfig()

	s3Cfg := s3.Config{
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}
	//OS ENV won't get environment variables set by VSCODE for debugging
	_ = os.Setenv(appconfig.LocalMinioAddressKey, config.GetString(appconfig.LocalMinioAddressKey))
	_ = os.Setenv(appconfig.LocalMinioS3AccessKey, config.GetString(appconfig.LocalMinioS3AccessKey))
	_ = os.Setenv(appconfig.LocalMinioS3SecretKey, config.GetString(appconfig.LocalMinioS3SecretKey))

	return s3.NewS3Client(s3Cfg)
}
