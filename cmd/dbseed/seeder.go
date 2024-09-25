package main

import (
	"context"
	"fmt"

	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/local"
	"github.com/cms-enterprise/mint-app/pkg/oktaapi"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/emailtestconfigs"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// Seeder  is a struct which wraps configurations needed to seed data in the database
type Seeder struct {
	Config SeederConfig
}

func newSeeder(config SeederConfig) *Seeder {
	return &Seeder{
		Config: config,
	}
}

func newDefaultSeeder(viperConfig *viper.Viper) *Seeder {
	store, logger, s3Client, echimpS3Client, _, _ := getResolverDependencies(viperConfig)

	dataLoaders := loaders.NewDataLoaders(store)
	ctx := loaders.CTXWithLoaders(context.Background(), dataLoaders)
	ctx = appcontext.WithLogger(ctx, logger)
	ctx = appcontext.WithUserAccountService(ctx, userhelpers.UserAccountGetByIDLOADER)

	emailService, err := emailtestconfigs.InitializeOddMailService()
	if err != nil {
		panic(fmt.Errorf("issue creating the email service"))
	}
	emailTemplateService, err := emailtestconfigs.InitializeEmailTemplateService()
	if err != nil {
		panic(fmt.Errorf("issue creating the email template service"))
	}
	addressBook := emailtestconfigs.InitializeAddressBook()

	oktaClient, oktaClientErr := local.NewOktaAPIClient()
	if oktaClientErr != nil {
		logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
	}

	seederConfig := SeederConfig{
		Store:                store,
		Logger:               logger,
		S3Client:             s3Client,
		EChimpClient:         echimpS3Client,
		Context:              ctx,
		EmailService:         emailService,
		EmailTemplateService: emailTemplateService,
		AddressBook:          addressBook,
		OktaClient:           oktaClient,
		viperConfig:          viperConfig,
	}
	return newSeeder(seederConfig)

}

// SeederConfig represents configuration a Seeder uses to seed data in the db
type SeederConfig struct {
	Store                *storage.Store
	Logger               *zap.Logger
	S3Client             *s3.S3Client
	EChimpClient         *s3.S3Client
	Context              context.Context
	EmailService         oddmail.EmailService
	EmailTemplateService email.TemplateService
	AddressBook          email.AddressBook
	OktaClient           oktaapi.Client
	viperConfig          *viper.Viper
}
