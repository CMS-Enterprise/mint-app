package main

import (
	"fmt"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

// The main entrypoint for the dbseed command.
// Invoke with "go run cmd/dbseed"
func main() {
	var rootCmd = &cobra.Command{
		Use:   "dbseed",
		Short: "Seed the DB",
		Long:  "Seeds the Database with Model Plans and associated data",
		Run: func(cmd *cobra.Command, args []string) {
			config := viper.New()
			config.AutomaticEnv()
			seedData(config)
		},
	}

	err := rootCmd.Execute()
	if err != nil {
		panic(err)
	}
}

// getResolverDependencies takes a Viper config and returns a Store and Logger object to be used
// by various resolver functions.
func getResolverDependencies(config *viper.Viper) (
	*storage.Store,
	*zap.Logger,
	*upload.S3Client,
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

// seedData gets resolver dependencies and calls wrapped resolver functions to seed data.
// If you want to add more seeded data, or edit seeded data, this is the function to edit!
// NOTE: Some of this data _is_ relied on by Cypress tests, but most of it is freely editable.
func seedData(config *viper.Viper) {
	// Get dependencies for resolvers (store and logger)
	store, logger, s3Client, _, _ := getResolverDependencies(config)

	// Seed an empty plan
	createModelPlan(store, logger, "Empty Plan", "MINT")

	// Seed a plan with some information already in it
	planWithBasics := createModelPlan(store, logger, "Plan with Basics", "MINT")
	updatePlanBasics(store, logger, planWithBasics, map[string]interface{}{
		"modelType":       models.MTVoluntary,
		"goal":            "Some goal",
		"cmsCenters":      []string{"CMMI", "OTHER"},
		"cmsOther":        "SOME OTHER CMS CENTER",
		"cmmiGroups":      []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
		"completeICIP":    "2020-05-13T20:47:50.12Z",
		"phasedIn":        true,
		"clearanceStarts": time.Now(),
		"highLevelNote":   "Some high level note",
	})

	// Seed a plan with collaborators
	planWithCollaborators := createModelPlan(store, logger, "Plan With Collaborators", "MINT")
	addPlanCollaborator(
		store,
		nil,
		nil,
		logger,
		planWithCollaborators,
		&model.PlanCollaboratorCreateInput{
			ModelPlanID: planWithCollaborators.ID,
			EuaUserID:   "BTAL",
			FullName:    "Betty Alpha",
			TeamRole:    models.TeamRoleLeadership,
			Email:       "bAlpha@local.fake",
		})

	// Seed a plan with CRs / TDLs
	planWithCrTDLs := createModelPlan(store, logger, "Plan With CRs and TDLs", "MINT")
	addCrTdl(store, logger, planWithCrTDLs, &model.PlanCrTdlCreateInput{
		ModelPlanID:   planWithCrTDLs.ID,
		IDNumber:      "CR-123",
		DateInitiated: time.Now(),
		Title:         "My CR",
		Note:          nil,
	})
	tdlNote := "My TDL note"
	addCrTdl(store, logger, planWithCrTDLs, &model.PlanCrTdlCreateInput{
		ModelPlanID:   planWithCrTDLs.ID,
		IDNumber:      "TDL-123",
		DateInitiated: time.Now(),
		Title:         "My TDL",
		Note:          &tdlNote,
	})

	// Seed a plan that is already archived
	archivedPlan := createModelPlan(store, logger, "Archived Plan", "MINT")
	updateModelPlan(store, logger, archivedPlan, map[string]interface{}{
		"archived": true,
	})

	// Seed a plan with some documents
	planWithDocuments := createModelPlan(store, logger, "Plan with Documents", "MINT")
	_ = planDocumentCreate(store, logger, s3Client, planWithDocuments, "File (Unscanned)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeConceptPaper, false, nil, nil, false, false)
	_ = planDocumentCreate(store, logger, s3Client, planWithDocuments, "File (Scanned - No Virus)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeMarketResearch, false, nil, zero.StringFrom("Company Presentation").Ptr(), true, false)
	_ = planDocumentCreate(store, logger, s3Client, planWithDocuments, "File (Scanned - Virus Found)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeOther, false, zero.StringFrom("Trojan Horse").Ptr(), nil, true, true)

	sampleModelName := "Enhancing Oncology Model"
	sampleModelPlan := createModelPlan(store, logger, sampleModelName, "MINT")
	addCrTdl(store, logger, planWithCrTDLs, &model.PlanCrTdlCreateInput{
		ModelPlanID:   sampleModelPlan.ID,
		IDNumber:      "TDL-123",
		DateInitiated: time.Now(),
		Title:         "My TDL",
		Note:          &tdlNote,
	})
	_ = planDocumentCreate(store, logger, s3Client, sampleModelPlan, "File (Scanned - No Virus)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeMarketResearch, nil, zero.StringFrom("Oncology Model Information").Ptr(), true, false)
	addPlanCollaborator(
		store,
		nil,
		nil,
		logger,
		sampleModelPlan,
		&model.PlanCollaboratorCreateInput{
			ModelPlanID: sampleModelPlan.ID,
			EuaUserID:   "BTAL",
			FullName:    "Betty Alpha",
			TeamRole:    models.TeamRoleLeadership,
			Email:       "bAlpha@local.fake",
		})
	updatePlanBasics(store, logger, sampleModelPlan, map[string]interface{}{
		"modelType":       models.MTVoluntary,
		"goal":            "Some goal",
		"cmsCenters":      []string{"CMMI", "OTHER"},
		"cmsOther":        "SOME OTHER CMS CENTER",
		"cmmiGroups":      []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
		"completeICIP":    "2020-05-13T20:47:50.12Z",
		"phasedIn":        true,
		"clearanceStarts": time.Now(),
		"highLevelNote":   "Some high level note",
	})

}
