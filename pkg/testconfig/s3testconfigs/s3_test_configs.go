// Package s3testconfigs is a utility package that allows us to easily configure test S3 clients
package s3testconfigs

import (
	"os"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/testhelpers"
	"github.com/cms-enterprise/mint-app/pkg/upload"
)

// S3TestClient returns an S3Test client for testing
func S3TestClient() upload.S3Client {
	config := testhelpers.NewConfig()

	s3Cfg := upload.Config{
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}
	//OS ENV won't get environment variables set by VSCODE for debugging
	_ = os.Setenv(appconfig.LocalMinioAddressKey, config.GetString(appconfig.LocalMinioAddressKey))
	_ = os.Setenv(appconfig.LocalMinioS3AccessKey, config.GetString(appconfig.LocalMinioS3AccessKey))
	_ = os.Setenv(appconfig.LocalMinioS3SecretKey, config.GetString(appconfig.LocalMinioS3SecretKey))

	return upload.NewS3Client(s3Cfg)
}
