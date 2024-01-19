package main

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"

	ld "github.com/launchdarkly/go-server-sdk/v6"
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
			seed(config)
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
	store, err := storage.NewStore(dbConfig, ldClient)
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

// SeedData uses seeder to seed data in the database
func seed(config *viper.Viper) {
	seeder := newDefaultSeeder(config)
	seeder.SeedData()
}

// SeedData gets resolver dependencies and calls wrapped resolver functions to seed data.
// If you want to add more seeded data, or edit seeded data, this is the function to edit!
// NOTE: Some of this data _is_ relied on by Cypress tests, but most of it is freely editable.
func (s *Seeder) SeedData() {
	links, err := resolvers.ExistingModelCollectionGet(s.Config.Logger, s.Config.Store)
	if err != nil {
		panic(err)
	}

	// Seed an empty plan
	s.createModelPlan("Empty Plan", "MINT")

	// Seed a plan with some information already in it
	planWithBasics := s.createModelPlan("Plan with Basics", "MINT")
	s.updatePlanBasics(
		nil,
		nil,
		email.AddressBook{},
		planWithBasics,
		map[string]interface{}{
			"modelType":       []models.ModelType{models.MTVoluntary},
			"goal":            "Some goal",
			"cmsCenters":      []string{"CMMI"},
			"cmmiGroups":      []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
			"completeICIP":    "2020-05-13T20:47:50.12Z",
			"phasedIn":        true,
			"clearanceStarts": time.Now(),
			"highLevelNote":   "Some high level note",
		},
	)
	s.existingModelLinkCreate(planWithBasics, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, []int{links[3].ID, links[4].ID}, nil)

	// Seed a plan with collaborators
	planWithCollaborators := s.createModelPlan("Plan With Collaborators", "MINT")
	s.addPlanCollaborator(
		nil,
		nil,
		planWithCollaborators,
		&model.PlanCollaboratorCreateInput{
			ModelPlanID: planWithCollaborators.ID,
			UserName:    "BTAL",
			TeamRoles:   []models.TeamRole{models.TeamRoleLeadership},
		})

	s.existingModelLinkCreate(planWithCollaborators, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, []int{links[4].ID}, nil)

	// Seed a plan with CRs / TDLs
	planWithCrTDLs := s.createModelPlan("Plan With CRs and TDLs", "MINT")
	s.addCrTdl(planWithCrTDLs, &model.PlanCrTdlCreateInput{
		ModelPlanID:   planWithCrTDLs.ID,
		IDNumber:      "CR-123",
		DateInitiated: time.Now(),
		Title:         "My CR",
		Note:          nil,
	})
	tdlNote := "My TDL note"
	s.addCrTdl(planWithCrTDLs, &model.PlanCrTdlCreateInput{
		ModelPlanID:   planWithCrTDLs.ID,
		IDNumber:      "TDL-123",
		DateInitiated: time.Now(),
		Title:         "My TDL",
		Note:          &tdlNote,
	})
	s.existingModelLinkCreate(planWithCrTDLs, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, nil, []uuid.UUID{planWithCollaborators.ID, planWithBasics.ID})

	// Seed a plan that is already archived
	archivedPlan := s.createModelPlan("Archived Plan", "MINT")
	s.updateModelPlan(archivedPlan, map[string]interface{}{
		"archived":     true,
		"abbreviation": "arch",
	})

	// Seed a plan with some documents
	planWithDocuments := s.createModelPlan("Plan with Documents", "MINT")
	restrictedDocument := s.planDocumentCreate(planWithDocuments, "File (Unscanned)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeConceptPaper, true, nil, nil, false, false)
	unrestrictedDocument := s.planDocumentCreate(planWithDocuments, "File (Scanned - No Virus)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeMarketResearch, false, nil, zero.StringFrom("Company Presentation").Ptr(), true, false)
	_ = s.planDocumentCreate(planWithDocuments, "File (Scanned - Virus Found)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeOther, false, zero.StringFrom("Trojan Horse").Ptr(), nil, true, true)

	sampleModelName := "Enhancing Oncology Model"
	sampleModelPlan := s.createModelPlan(sampleModelName, "MINT")
	s.addCrTdl(planWithCrTDLs, &model.PlanCrTdlCreateInput{
		ModelPlanID:   sampleModelPlan.ID,
		IDNumber:      "TDL-123",
		DateInitiated: time.Now(),
		Title:         "My TDL",
		Note:          &tdlNote,
	})
	_ = s.planDocumentCreate(sampleModelPlan, "File (Scanned - No Virus)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeMarketResearch, false, nil, zero.StringFrom("Oncology Model Information").Ptr(), true, false)
	s.addPlanCollaborator(
		nil,
		nil,
		sampleModelPlan,
		&model.PlanCollaboratorCreateInput{
			ModelPlanID: sampleModelPlan.ID,
			UserName:    "BTAL",
			TeamRoles:   []models.TeamRole{models.TeamRoleLeadership},
		})
	s.updatePlanBasics(
		nil,
		nil,
		email.AddressBook{},
		sampleModelPlan,
		map[string]interface{}{
			"amsModelID":      "123",
			"demoCode":        "1",
			"modelType":       []models.ModelType{models.MTVoluntary},
			"goal":            "Some goal",
			"cmsCenters":      []string{"CMMI"},
			"cmmiGroups":      []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
			"completeICIP":    "2020-05-13T20:47:50.12Z",
			"phasedIn":        true,
			"clearanceStarts": time.Now(),
			"highLevelNote":   "Some high level note",
		},
	)

	operationalNeeds := s.getOperationalNeedsByModelPlanID(planWithDocuments.ID)
	if len(operationalNeeds) < 1 {
		panic("operational needs must be populated in order to create an operational solution")
	}

	operationalSolution := s.addOperationalSolution(
		planWithDocuments,
		operationalNeeds[0].ID,
		map[string]interface{}{
			"needed":        false,
			"pocName":       "The Gump",
			"pocEmail":      "shrimpKing@gump.com",
			"mustStartDts":  "2023-02-04T21:39:57.484167Z",
			"mustFinishDts": "2023-12-04T21:39:57.484167Z",
		},
	)

	_ = s.addPlanDocumentSolutionLinks(
		planWithDocuments,
		operationalSolution.ID,
		[]uuid.UUID{
			restrictedDocument.ID,
			unrestrictedDocument.ID,
		},
	)

	_ = s.operationalSolutionSubtasksCreate(
		planWithBasics,
		operationalSolution.ID,
		[]*model.CreateOperationalSolutionSubtaskInput{
			{
				Name:   "Create the thing!",
				Status: models.OperationalSolutionSubtaskStatusInProgress,
			}, {
				Name:   "Do the thing!",
				Status: models.OperationalSolutionSubtaskStatusTodo,
			},
		},
	)
}
