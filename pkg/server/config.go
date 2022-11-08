package server

import (
	"fmt"
	"time"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/appses"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"
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

	// useIAM := s.environment.Deployed()
	useIAM := false // TODO Reintroduce this when we figure out how RDS/IAM work together.
	if !useIAM {    // If not using IAM, fall back to using PGPASS
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

// NewSESConfig returns a new email.Config and checks required fields
func (s Server) NewSESConfig() appses.Config {
	s.checkRequiredConfig(appconfig.AWSSESSourceARNKey)
	s.checkRequiredConfig(appconfig.AWSSESSourceKey)

	return appses.Config{
		SourceARN: s.Config.GetString(appconfig.AWSSESSourceARNKey),
		Source:    s.Config.GetString(appconfig.AWSSESSourceKey),
	}
}

// NewS3Config returns a new s3.Config and checks required fields
func (s Server) NewS3Config() upload.Config {
	s.checkRequiredConfig(appconfig.AWSS3FileUploadBucket)
	s.checkRequiredConfig(appconfig.AWSRegion)

	return upload.Config{
		Bucket:  s.Config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  s.Config.GetString(appconfig.AWSRegion),
		IsLocal: false,
	}
}

// NewCEDARClientCheck checks if CEDAR clients are not connectable
func (s Server) NewCEDARClientCheck() {
	s.checkRequiredConfig(appconfig.CEDARAPIURL)
	s.checkRequiredConfig(appconfig.CEDARAPIKey)
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

	switch flagSource {
	case appconfig.FlagSourceLocal:
		timeout = 0
		key = "local-has-no-key"
	case appconfig.FlagSourceLaunchDarkly:
		s.checkRequiredConfig(appconfig.LDKey)
		s.checkRequiredConfig(appconfig.LDTimeout)
		timeout = time.Duration(s.Config.GetInt(appconfig.LDTimeout)) * time.Second
		key = s.Config.GetString(appconfig.LDKey)
	default:
		opts := []appconfig.FlagSourceOption{appconfig.FlagSourceLocal, appconfig.FlagSourceLaunchDarkly}
		s.logger.Fatal(fmt.Sprintf("%s must be set to one of %v", appconfig.FlagSourceKey, opts))
	}

	return flags.Config{
		Source:  flagSource,
		Key:     key,
		Timeout: timeout,
	}
}
