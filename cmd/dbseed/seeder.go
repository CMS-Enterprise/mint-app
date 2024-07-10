package main

import (
	"context"
	"fmt"

	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/local"
	"github.com/cmsgov/mint-app/pkg/oktaapi"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
	"github.com/cmsgov/mint-app/pkg/testconfig/emailtestconfigs"
	"github.com/cmsgov/mint-app/pkg/upload"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
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
	store, logger, s3Client, _, _ := getResolverDependencies(viperConfig)

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
		Context:              ctx,
		EmailService:         emailService,
		EmailTemplateService: emailTemplateService,
		AddressBook:          addressBook,
		OktaClient:           oktaClient,
	}
	return newSeeder(seederConfig)

}

// SeederConfig represents configuration a Seeder uses to seed data in the db
type SeederConfig struct {
	Store                *storage.Store
	Logger               *zap.Logger
	S3Client             *upload.S3Client
	Context              context.Context
	EmailService         oddmail.EmailService
	EmailTemplateService email.TemplateService
	AddressBook          email.AddressBook
	OktaClient           oktaapi.Client
}
