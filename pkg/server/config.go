package server

import (
	"fmt"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/flags"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

const configMissingMessage = "Must set config: %v"

func (s Server) checkRequiredConfig(config string) {
	if s.Config.GetString(config) == "" {
		s.logger.Fatal(fmt.Sprintf(configMissingMessage, config))
	}
}

// NewDBConfig returns a new DBConfig and check required fields
func (s Server) NewDBConfig() storage.DBConfig {
	s.checkRequiredConfig(appconfig.DBHostConfigKey)
	s.checkRequiredConfig(appconfig.DBPortConfigKey)
	s.checkRequiredConfig(appconfig.DBNameConfigKey)
	s.checkRequiredConfig(appconfig.DBUsernameConfigKey)
	s.checkRequiredConfig(appconfig.DBMaxConnections)

	useIAM := s.environment.Deployed()
	if !useIAM { // If not using IAM, fall back to using PGPASS
		s.checkRequiredConfig(appconfig.DBPasswordConfigKey)
	}
	s.checkRequiredConfig(appconfig.DBSSLModeConfigKey)
	return storage.DBConfig{
		Host:           s.Config.GetString(appconfig.DBHostConfigKey),
		Port:           s.Config.GetString(appconfig.DBPortConfigKey),
		Database:       s.Config.GetString(appconfig.DBNameConfigKey),
		Username:       s.Config.GetString(appconfig.DBUsernameConfigKey),
		Password:       s.Config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        s.Config.GetString(appconfig.DBSSLModeConfigKey),
		UseIAM:         useIAM,
		MaxConnections: s.Config.GetInt(appconfig.DBMaxConnections),
	}
}

// NewS3Config returns a new s3.Config and checks required fields
func (s Server) NewS3Config() s3.Config {
	s.checkRequiredConfig(appconfig.AWSS3FileUploadBucket)
	s.checkRequiredConfig(appconfig.AWSRegion)

	return s3.Config{
		Bucket:  s.Config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  s.Config.GetString(appconfig.AWSRegion),
		IsLocal: false,
	}
}

// NewEChimpS3Config returns a new s3.Config and checks required fields
//
// appconfig.AWSS3ECHIMPBucket is purposely not required here since the connection to ECHIMP is _not_ enabled in every environment
// Check the `echimpEnabled` flag in LaunchDarkly to see if the connection is enabled in the envrionment you're testing against.
// https://app.launchdarkly.com/projects/mint/flags/echimpEnabled/targeting?env=local&env=dev&env=test&env=impl&env=production
func (s Server) NewEChimpS3Config() s3.Config {
	s.checkRequiredConfig(appconfig.AWSRegion)

	return s3.Config{
		Bucket:  s.Config.GetString(appconfig.AWSS3ECHIMPBucket),
		Region:  s.Config.GetString(appconfig.AWSRegion),
		IsLocal: false,
	}
}

// OktaClientConfig is the okta client configuration
type OktaClientConfig struct {
	OktaClientID string
	OktaIssuer   string
}

// NewOktaClientConfig returns the okta client config
func (s Server) NewOktaClientConfig() OktaClientConfig {
	s.checkRequiredConfig(appconfig.OktaClientID)
	s.checkRequiredConfig(appconfig.OktaIssuer)

	return OktaClientConfig{
		OktaClientID: s.Config.GetString(appconfig.OktaClientID),
		OktaIssuer:   s.Config.GetString(appconfig.OktaIssuer),
	}
}

// NewOktaAPIClientCheck checks if the Okta API client is configured
func (s Server) NewOktaAPIClientCheck() {
	s.checkRequiredConfig(appconfig.OKTAApiURL)
	s.checkRequiredConfig(appconfig.OKTAAPIToken)
}

// NewLocalAuthIsEnabled returns if local auth is enabled
func (s Server) NewLocalAuthIsEnabled() bool {
	return s.Config.GetBool(appconfig.LocalAuthEnabled)
}

// LambdaConfig is the config to call a lambda func
type LambdaConfig struct {
	Endpoint     string
	FunctionName string
}

// NewPrinceLambdaConfig returns the configutation for the prince lambda
func (s Server) NewPrinceLambdaConfig() LambdaConfig {
	endpoint := s.Config.GetString(appconfig.LambdaEndpoint)
	name := s.Config.GetString(appconfig.LambdaFunctionPrince)

	return LambdaConfig{
		Endpoint:     endpoint,
		FunctionName: name,
	}
}

// NewFlagConfig checks if Launch Darkly config exists
func (s Server) NewFlagConfig() flags.Config {
	s.checkRequiredConfig(appconfig.FlagSourceKey)

	flagSource := appconfig.FlagSourceOption(s.Config.GetString(appconfig.FlagSourceKey))

	var timeout time.Duration
	var key string
	var flagValuesFile string

	switch flagSource {
	case appconfig.FlagSourceLocal:
		timeout = 0
		key = "local-has-no-key"
	case appconfig.FlagSourceLaunchDarkly:
		s.checkRequiredConfig(appconfig.LDKey)
		s.checkRequiredConfig(appconfig.LDTimeout)
		timeout = time.Duration(s.Config.GetInt(appconfig.LDTimeout)) * time.Second
		key = s.Config.GetString(appconfig.LDKey)
	case appconfig.FlagSourceFile:
		s.checkRequiredConfig(appconfig.FlagValuesFileKey)
		flagValuesFile = s.Config.GetString(appconfig.FlagValuesFileKey)
	default:
		opts := []appconfig.FlagSourceOption{
			appconfig.FlagSourceLocal,
			appconfig.FlagSourceLaunchDarkly,
			appconfig.FlagSourceFile,
		}
		s.logger.Fatal(fmt.Sprintf("%s must be set to one of %v", appconfig.FlagSourceKey, opts))
	}

	return flags.Config{
		Source:         flagSource,
		Key:            key,
		Timeout:        timeout,
		FlagValuesFile: flagValuesFile,
	}
}
