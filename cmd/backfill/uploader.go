package main

import (
	"fmt"

	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

// Uploader handles functionality for uploading data to the DB
type Uploader struct {
	Store  storage.Store
	Logger zap.Logger
}

// NewUploader instantiates an Uploader
func NewUploader() *Uploader { //TODO make this more configurable if needed
	config := viper.New()
	config.AutomaticEnv()

	store, logger, _, _, _ := getResolverDependencies(config)
	return &Uploader{
		Store:  *store,
		Logger: *logger,
	}

}

func (u *Uploader) uploadEntries(entries []*BackfillEntry) { //TODO add more error handling to this

	for i := 0; i < len(entries); i++ {

		err := u.uploadEntry(entries[i])
		if err != nil {
			u.Logger.Error(err.Error())
		}
	}
}

func (u *Uploader) uploadEntry(entry *BackfillEntry) error {

	//TODO make sure to capture all upload errors and store them somewhere

	modelPlan, err := resolvers.ModelPlanCreate(&u.Logger, entry.ModelPlan.ModelName, &u.Store, nil, nil)
	if err != nil {
		return err //TODO capture all errors and return collection? Or early return?

	}
	u.Logger.Log(zap.DebugLevel, "created modelPlan "+modelPlan.ModelName) //TODO need better logging?

	return nil

}

// getResolverDependencies takes a Viper config and returns a Store and Logger object to be used
// by various resolver functions.
func getResolverDependencies(config *viper.Viper) (
	*storage.Store,
	*zap.Logger,
	*upload.S3Client, //TODO isd this needed?
	oddmail.EmailService,
	email.TemplateService,
) {
	// Create the logger
	logger := zap.NewNop()

	// Create LD Client, which is required for creating the store
	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if err != nil {
		panic(err)
	}

	// Create the DB Config & Store
	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
	store, err := storage.NewStore(logger, dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		panic(err)
	}

	// Create S3 client
	s3Cfg := upload.Config{
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}

	s3Client := upload.NewS3Client(s3Cfg)

	return store, logger, &s3Client, nil, nil
}
