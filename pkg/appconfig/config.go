package appconfig

import "fmt"

// NewEnvironment returns an environment from a string
func NewEnvironment(config string) (Environment, error) {
	switch config {
	case localEnv.String():
		return localEnv, nil
	case testingEnv.String():
		return testingEnv, nil
	case testEnv.String():
		return testEnv, nil
	case devEnv.String():
		return devEnv, nil
	case implEnv.String():
		return implEnv, nil
	case prodEnv.String():
		return prodEnv, nil
	default:
		return "", fmt.Errorf("unknown environment: %s", config)
	}
}

// EnvironmentKey is used to access the environment from a config
const EnvironmentKey = "APP_ENV"

// Environment represents an environment
type Environment string

const (
	// localEnv is the local environment
	localEnv Environment = "local"
	// testingEnv is the environment for running tests
	testingEnv Environment = "testing"
	// testEnv is the environment for the test deployed env
	testEnv Environment = "test"
	// devEnv is the environment for the dev deployed env
	devEnv Environment = "dev"
	// implEnv is the environment for the impl deployed env
	implEnv Environment = "impl"
	// prodEnv is the environment for the prod deployed env
	prodEnv Environment = "prod"
)

// String gets the environment as a string
func (e Environment) String() string {
	switch e {
	case localEnv:
		return "local"
	case testingEnv:
		return "testing"
	case testEnv:
		return "test"
	case devEnv:
		return "dev"
	case implEnv:
		return "impl"
	case prodEnv:
		return "prod"
	default:
		return ""
	}
}

// Local returns true if the environment is local
func (e Environment) Local() bool {
	return e == localEnv
}

// Testing returns true if the environment is testing
func (e Environment) Testing() bool {
	return e == testingEnv
}

// Test returns true if the environment is local
func (e Environment) Test() bool {
	return e == testEnv
}

// Dev returns true if the environment is local
func (e Environment) Dev() bool {
	return e == devEnv
}

// Impl returns true if the environment is local
func (e Environment) Impl() bool {
	return e == implEnv
}

// Prod returns true if the environment is local
func (e Environment) Prod() bool {
	return e == prodEnv
}

// Deployed returns true if in a deployed environment
func (e Environment) Deployed() bool {
	switch e {
	case devEnv:
		return true
	case testEnv:
		return true
	case implEnv:
		return true
	case prodEnv:
		return true
	default:
		return false
	}
}

// DBHostConfigKey is the Postgres hostname config key
const DBHostConfigKey = "PGHOST"

// DBPortConfigKey is the Postgres port config key
const DBPortConfigKey = "PGPORT"

// DBNameConfigKey is the Postgres database name config key
const DBNameConfigKey = "PGDATABASE"

// DBUsernameConfigKey is the Postgres username config key
const DBUsernameConfigKey = "PGUSER"

// DBPasswordConfigKey is the Postgres password config key
const DBPasswordConfigKey = "PGPASS"

// DBSSLModeConfigKey is the Postgres SSL mode config key
const DBSSLModeConfigKey = "PGSSLMODE"

// DBMaxConnections is the maximum number of connections to the database
const DBMaxConnections = "DB_MAX_CONNECTIONS"

// GRTEmailKey is the key for the receiving email for the GRT
const GRTEmailKey = "GRT_EMAIL"

// AccessibilityTeamEmailKey is the key for the receiving email for the 508 team
const AccessibilityTeamEmailKey = "ACCESSIBILITY_TEAM_EMAIL"

// MINTTeamEmailKey is the key for the receiving email for the MINT team
const MINTTeamEmailKey = "MINT_TEAM_EMAIL"

// DevTeamEmailKey is the key for getting the email sender
const DevTeamEmailKey = "DEV_TEAM_EMAIL"

// DateChangedRecipientEmailsKey is the key for the receiving email addresses for
// the model plan date changed email notification
const DateChangedRecipientEmailsKey = "DATE_CHANGED_RECIPIENT_EMAILS"

// EmailHostKey is the key for getting the email service's host
const EmailHostKey = "EMAIL_HOST"

// EmailPortKey is the key for getting the email service's port
const EmailPortKey = "EMAIL_PORT"

// EmailSenderKey is the key for getting the email sender
const EmailSenderKey = "EMAIL_SENDER"

// EmailEnabledKey is the key for checking if we should use email service
const EmailEnabledKey = "EMAIL_ENABLED"

// ClientHostKey is the key for getting the client's domain name
const ClientHostKey = "CLIENT_HOSTNAME"

// ClientProtocolKey is the key for getting the client's protocol
const ClientProtocolKey = "CLIENT_PROTOCOL"

// ClientAddressKey is the key for getting the client's address
const ClientAddressKey = "CLIENT_ADDRESS"

// // EmailTemplateDirectoryKey is the key for getting the email template directory
// const EmailTemplateDirectoryKey = "EMAIL_TEMPLATE_DIR"

// AWSS3FileUploadBucket is the key for the bucket we upload files to
const AWSS3FileUploadBucket = "AWS_S3_FILE_UPLOAD_BUCKET"

// AWSS3ECHIMPBucket is the key for the bucket we EChimp data files are located
const AWSS3ECHIMPBucket = "AWS_S3_ECHIMP_BUCKET"

// LDEChimpEnabledKey is the key for retrieving the bool if echimp is enabled to grab from S3
const LDEChimpEnabledKey = "echimp-enabled"

// LocalMinioAddressKey is the host used for local minio
const LocalMinioAddressKey = "MINIO_ADDRESS"

// LocalMinioS3AccessKey is a key used for local access to minio
const LocalMinioS3AccessKey = "MINIO_ACCESS_KEY"

// LocalMinioS3SecretKey is the secret key used for local access to minio
const LocalMinioS3SecretKey = "MINIO_SECRET_KEY"

// AWSRegion is the key for the region we establish a session to for AWS services
const AWSRegion = "AWS_REGION"

// CEDARAPIURL is the key for the CEDAR base url
const CEDARAPIURL = "CEDAR_API_URL"

// CEDARAPIKey is the key for accessing CEDAR
const CEDARAPIKey = "CEDAR_API_KEY" // #nosec G101 false positive - not the actual API key itself

// OKTAApiURL is the key for the Okta API url
const OKTAApiURL = "OKTA_API_URL"

// OKTAAPIToken is the key for the Okta API token
const OKTAAPIToken = "OKTA_API_TOKEN" // #nosec G101 false positive - not the actual API key itself

// LDKey is the key for accessing LaunchDarkly
const LDKey = "LD_SDK_KEY"

// LDTimeout is the key for accessing LaunchDarkly
const LDTimeout = "LD_TIMEOUT_SECONDS"

// FlagSourceKey indicates where flags should be loaded from
const FlagSourceKey = "FLAG_SOURCE"

// FlagValuesFileKey is the key for the environment variable with the file path to a LaunchDarkly flag values file
const FlagValuesFileKey = "FLAGDATA_FILE"

// LambdaEndpoint is the host to direct lambda requests to
const LambdaEndpoint = "LAMBDA_ENDPOINT"

// LambdaFunctionPrince is the name of the prince lambda function
const LambdaFunctionPrince = "LAMBDA_FUNCTION_PRINCE"

// LocalAuthEnabled is whether local auth should be enabled
const LocalAuthEnabled = "LOCAL_AUTH_ENABLED"

// OktaClientID is the okta client id
const OktaClientID = "OKTA_CLIENT_ID"

// OktaIssuer is the okta issuer
const OktaIssuer = "OKTA_ISSUER"

// FaktoryProcessJobs if jobs should be processed
const FaktoryProcessJobs = "FAKTORY_PROCESS_JOBS"

// FaktoryConnections number of connections for a manager
const FaktoryConnections = "FAKTORY_CONNECTIONS"

// FlagSourceOption represents an environment
type FlagSourceOption string

// TaggedSolutionPointOfContactEmailEnabled is the key to detemermine whether points of contacts should receive an email if they are tagged or not.
const TaggedSolutionPointOfContactEmailEnabled = "TAG_POC_EMAILS_ENABLED"

const (
	// FlagSourceLocal is LOCAL
	FlagSourceLocal FlagSourceOption = "LOCAL"

	// FlagSourceFile is FILE (for setting LaunchDarkly flag values in a file for use when testing)
	FlagSourceFile FlagSourceOption = "FILE"

	// FlagSourceLaunchDarkly is LAUNCH_DARKLY
	FlagSourceLaunchDarkly FlagSourceOption = "LAUNCH_DARKLY"
)
