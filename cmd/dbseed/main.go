package main

import (
	"fmt"
	"os"
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

var viperConfig = viper.New()
var rootCmd = &cobra.Command{
	Use:   "seeder",
	Short: "Runs the seed commands as an interactive tui",
	Long:  "Runs the seed commands as an interactive tui",
	Run: func(cmd *cobra.Command, args []string) {
		RunSeedCommandTuiModel()
	},
}
var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "Seed the DB",
	Long:  "Seeds the Database with Model Plans and associated data",
	Run: func(cmd *cobra.Command, args []string) {
		seed(viperConfig)
	},
}

var cleanCmd = &cobra.Command{
	Use:   "clean",
	Short: "Clean the DB",
	Long:  "Truncates all user entered data in the Database",
	Run: func(cmd *cobra.Command, args []string) {
		clean(viperConfig)
	},
}

// clean uses seeder to remove all data in the database
func clean(config *viper.Viper) {
	seeder := newDefaultSeeder(config)
	err := seeder.Config.Store.TruncateAllTablesDANGEROUS(seeder.Config.Logger)
	if err != nil {
		fmt.Print(err)
	}
}

// The main entrypoint for the dbseed command.
// Invoke with "go run cmd/dbseed"
func main() {
	execute()
}

func init() {
	viperConfig.AutomaticEnv()
	rootCmd.AddCommand(seedCmd)
	rootCmd.AddCommand(analyzeAuditCommand)
	rootCmd.AddCommand(cleanCmd)
	rootCmd.AddCommand(translationExportCmd)

	// job based audit translation commands
	rootCmd.AddCommand(queueAndProcessAllTranslatedAuditChangesCommand)

}

func execute() {
	// get Variables once instead of in multiple places
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
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
	seeder.CreateAnalyzedAuditData()
	seeder.SetDefaultUserViews()
}

// SeedData gets resolver dependencies and calls wrapped resolver functions to seed data.
// If you want to add more seeded data, or edit seeded data, this is the function to edit!
// NOTE: Some of this data _is_ relied on by Cypress tests, but most of it is freely editable.
func (s *Seeder) SeedData() {
	links, err := resolvers.ExistingModelCollectionGet(s.Config.Logger, s.Config.Store)
	if err != nil {
		panic(err)
	}
	now := time.Now()

	// Seed an empty plan
	emptyPlan := s.createModelPlan("Empty Plan", "MINT")
	s.updateModelPlan(emptyPlan, map[string]interface{}{
		"abbreviation": "emptyPlan",
		"status":       models.ModelStatusCanceled,
	})

	emptyPlanOperationalNeeds := s.getOperationalNeedsByModelPlanID(emptyPlan.ID)
	if len(emptyPlanOperationalNeeds) < 1 {
		panic("operational needs must be populated in order to create an operational solution")
	}

	_ = s.addOperationalSolution(
		emptyPlan,
		emptyPlanOperationalNeeds[0].ID,
		map[string]interface{}{
			"needed":        false,
			"pocName":       "The Gump",
			"pocEmail":      "shrimpKing@gump.com",
			"mustStartDts":  "2023-02-04T21:39:57.484167Z",
			"mustFinishDts": "2023-12-04T21:39:57.484167Z",
		},
	)

	// Seed a plan with some information already in it
	planWithBasics := s.createModelPlan("Plan with Basics", "MINT")
	s.updatePlanBasics(
		s.Config.Context,
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
			"clearanceStarts": now,
			"highLevelNote":   "Some high level note",
		},
	)
	s.existingModelLinkCreate(planWithBasics, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, []int{links[3].ID, links[4].ID}, nil)
	s.updateModelPlan(planWithBasics, map[string]interface{}{
		"abbreviation": "basics",
		"status":       models.ModelStatusActive,
	})

	planWithBasicsOperationalNeeds := s.getOperationalNeedsByModelPlanID(planWithBasics.ID)
	if len(planWithBasicsOperationalNeeds) < 1 {
		panic("operational needs must be populated in order to create an operational solution")
	}

	_ = s.addOperationalSolution(
		planWithBasics,
		planWithBasicsOperationalNeeds[0].ID,
		map[string]interface{}{
			"needed":        false,
			"pocName":       "The Gump",
			"pocEmail":      "shrimpKing@gump.com",
			"mustStartDts":  "2023-02-04T21:39:57.484167Z",
			"mustFinishDts": "2023-12-04T21:39:57.484167Z",
		},
	)

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

	s.updateModelPlan(planWithCollaborators, map[string]interface{}{
		"abbreviation": "collab",
		"status":       models.ModelStatusEnded,
	})

	planWithCollaboratorsOperationalNeeds := s.getOperationalNeedsByModelPlanID(planWithCollaborators.ID)
	if len(planWithBasicsOperationalNeeds) < 1 {
		panic("operational needs must be populated in order to create an operational solution")
	}

	_ = s.addOperationalSolution(
		planWithCollaborators,
		planWithCollaboratorsOperationalNeeds[0].ID,
		map[string]interface{}{
			"needed":        false,
			"pocName":       "The Gump",
			"pocEmail":      "shrimpKing@gump.com",
			"mustStartDts":  "2023-02-04T21:39:57.484167Z",
			"mustFinishDts": "2023-12-04T21:39:57.484167Z",
		},
	)

	s.existingModelLinkCreate(planWithCollaborators, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, []int{links[4].ID}, nil)

	// Seed a plan with CRs / TDLs
	planWithCrTDLs := s.createModelPlan("Plan With CRs and TDLs", "MINT")
	s.addCR(planWithCrTDLs, &model.PlanCRCreateInput{
		ModelPlanID:     planWithCrTDLs.ID,
		IDNumber:        "CR-123",
		DateInitiated:   now,
		DateImplemented: now,
		Title:           "My CR",
		Note:            nil,
	})
	tdlNote := "My TDL note"
	s.addTDL(planWithCrTDLs, &model.PlanTDLCreateInput{
		ModelPlanID:   planWithCrTDLs.ID,
		IDNumber:      "TDL-123",
		DateInitiated: now,
		Title:         "My TDL",
		Note:          &tdlNote,
	})
	s.existingModelLinkCreate(planWithCrTDLs, models.EMLFTGeneralCharacteristicsResemblesExistingModelWhich, nil, []uuid.UUID{planWithCollaborators.ID, planWithBasics.ID})

	s.updateModelPlan(planWithCrTDLs, map[string]interface{}{
		"abbreviation": "crTDLPlan",
		"status":       models.ModelStatusAnnounced,
	})

	planWithCrTDLsOperationalNeeds := s.getOperationalNeedsByModelPlanID(planWithCrTDLs.ID)
	if len(planWithCrTDLsOperationalNeeds) < 1 {
		panic("operational needs must be populated in order to create an operational solution")
	}

	_ = s.addOperationalSolution(
		planWithCrTDLs,
		planWithCrTDLsOperationalNeeds[0].ID,
		map[string]interface{}{
			"needed":        false,
			"pocName":       "The Gump",
			"pocEmail":      "shrimpKing@gump.com",
			"mustStartDts":  "2023-02-04T21:39:57.484167Z",
			"mustFinishDts": "2023-12-04T21:39:57.484167Z",
		},
	)

	// Seed a plan that is already archived
	archivedPlan := s.createModelPlan("Archived Plan", "MINT")
	s.updateModelPlan(archivedPlan, map[string]interface{}{
		"archived":     true,
		"abbreviation": "arch",
		"status":       models.ModelStatusPaused,
	})

	archivedPlanOperationalNeeds := s.getOperationalNeedsByModelPlanID(archivedPlan.ID)
	if len(archivedPlanOperationalNeeds) < 1 {
		panic("operational needs must be populated in order to create an operational solution")
	}

	_ = s.addOperationalSolution(
		archivedPlan,
		archivedPlanOperationalNeeds[0].ID,
		map[string]interface{}{
			"needed":        false,
			"pocName":       "The Gump",
			"pocEmail":      "shrimpKing@gump.com",
			"mustStartDts":  "2023-02-04T21:39:57.484167Z",
			"mustFinishDts": "2023-12-04T21:39:57.484167Z",
		},
	)

	// Seed a plan with some documents
	planWithDocuments := s.createModelPlan("Plan with Documents", "MINT")
	restrictedDocument := s.planDocumentCreate(planWithDocuments, "File (Unscanned)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeConceptPaper, true, nil, nil, false, false)
	unrestrictedDocument := s.planDocumentCreate(planWithDocuments, "File (Scanned - No Virus)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeMarketResearch, false, nil, zero.StringFrom("Company Presentation").Ptr(), true, false)
	_ = s.planDocumentCreate(planWithDocuments, "File (Scanned - Virus Found)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeOther, false, zero.StringFrom("Trojan Horse").Ptr(), nil, true, true)

	sampleModelName := "Enhancing Oncology Model"
	sampleModelPlan := s.createModelPlan(sampleModelName, "MINT")
	s.addTDL(planWithCrTDLs, &model.PlanTDLCreateInput{
		ModelPlanID:   sampleModelPlan.ID,
		IDNumber:      "TDL-123",
		DateInitiated: now,
		Title:         "My TDL",
		Note:          &tdlNote,
	})
	_ = s.planDocumentCreate(sampleModelPlan, "File (Scanned - No Virus)", "cmd/dbseed/data/sample.pdf", "application/pdf", models.DocumentTypeMarketResearch, false, nil, zero.StringFrom("Oncology Model Information").Ptr(), true, false)
	s.addPlanCollaborator(
		s.Config.EmailService,
		s.Config.EmailTemplateService,
		sampleModelPlan,
		&model.PlanCollaboratorCreateInput{
			ModelPlanID: sampleModelPlan.ID,
			UserName:    "BTAL",
			TeamRoles:   []models.TeamRole{models.TeamRoleLeadership},
		})
	s.updatePlanBasics(
		s.Config.Context,
		s.Config.EmailService,
		s.Config.EmailTemplateService,
		s.Config.AddressBook,
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
			"clearanceStarts": now,
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

	// Seed a plan that is has a clearance start date 3 months from today
	planApproachingClearance := s.createModelPlan("Plan Approaching Clearance in 3 months", "MINT")
	s.updateModelPlan(planApproachingClearance, map[string]interface{}{
		"abbreviation": "Clearance",
		"status":       models.ModelStatusPaused,
	})

	s.updatePlanBasics(
		s.Config.Context,
		nil,
		nil,
		email.AddressBook{},
		planApproachingClearance,
		map[string]interface{}{
			"modelType":       []models.ModelType{models.MTVoluntary},
			"goal":            "Some goal",
			"cmsCenters":      []string{"CMMI"},
			"cmmiGroups":      []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
			"completeICIP":    "2020-05-13T20:47:50.12Z",
			"phasedIn":        true,
			"clearanceStarts": time.Now().AddDate(0, 3, 0),
			"highLevelNote":   "Some high level note",
		},
	)

	// Send a notification for Data Exchange Approach Completed
	dataExchangeApproach := models.NewDataExchangeApproach(
		"Data Exchange Approach",
		planWithDocuments.CreatedBy,
		planWithDocuments.ID,
	)

	dataExchangeApproach.ID = uuid.MustParse("01020304-0506-0708-090a-0b0c0d0e0f10")

	// create an actor principal for testing notifications

	actorPrincipal := s.getTestPrincipalByUsername("MINT")

	// Use a test user to mark the data exchange approach as complete
	testUser := s.getTestPrincipalByUsername("BTAL")

	err = resolvers.SendDataExchangeApproachCompletedNotification(
		s.Config.Context,
		s.Config.EmailService,
		s.Config.EmailTemplateService,
		s.Config.AddressBook,
		actorPrincipal.UserAccount.ID,
		s.Config.Store,
		[]uuid.UUID{planWithDocuments.CreatedBy},
		planWithDocuments,
		dataExchangeApproach,
		testUser.UserAccount.ID,
	)
	if err != nil {
		panic(fmt.Errorf("failed to send data exchange approach completed notification: %w", err))
	}
}

func (s *Seeder) SetDefaultUserViews() {
	mintPrinc := s.getTestPrincipalByUsername("MINT")
	s.updateUserView(mintPrinc, map[string]interface{}{
		"viewCustomization":            []models.ViewCustomizationType{models.ViewCustomizationTypeModelsByOperationalSolution, models.ViewCustomizationTypeFollowedModels, models.ViewCustomizationTypeAllModelPlans},
		"possibleOperationalSolutions": []models.OperationalSolutionKey{models.OpSKInnovation, models.OpSKAcoOs},
	},
	)
}
