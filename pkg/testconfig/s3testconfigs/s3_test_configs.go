// Package s3testconfigs is a utility package that allows us to easily configure test S3 clients
package s3testconfigs

import (
	"os"

	"github.com/spf13/viper"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/s3"
)

// S3TestClient returns an S3Test client for testing
func S3TestClient(viperConfig *viper.Viper) s3.S3Client {

	s3Cfg := s3.Config{
		Bucket:  viperConfig.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  viperConfig.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}
	//OS GetEnv(called in NewS3Client ) won't get environment variables set by VSCODE for debugging. Set here for testing
	_ = os.Setenv(appconfig.LocalMinioAddressKey, viperConfig.GetString(appconfig.LocalMinioAddressKey))
	_ = os.Setenv(appconfig.LocalMinioS3AccessKey, viperConfig.GetString(appconfig.LocalMinioS3AccessKey))
	_ = os.Setenv(appconfig.LocalMinioS3SecretKey, viperConfig.GetString(appconfig.LocalMinioS3SecretKey))

	return s3.NewS3Client(s3Cfg)
}

// S3TestECHIMPClient returns an ECHIMPClient client for testing
func S3TestECHIMPClient(viperConf *viper.Viper) s3.S3Client {

	s3Cfg := s3.Config{
		Bucket:  viperConf.GetString(appconfig.AWSS3ECHIMPBucket),
		Region:  viperConf.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}
	//OS ENV won't get environment variables set by VSCODE for debugging
	_ = os.Setenv(appconfig.LocalMinioAddressKey, viperConf.GetString(appconfig.LocalMinioAddressKey))
	_ = os.Setenv(appconfig.LocalMinioS3AccessKey, viperConf.GetString(appconfig.LocalMinioS3AccessKey))
	_ = os.Setenv(appconfig.LocalMinioS3SecretKey, viperConf.GetString(appconfig.LocalMinioS3SecretKey))

	return s3.NewS3Client(s3Cfg)
}
