package main

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/spf13/cobra"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

// analyzeAuditCommand is an entry point for analyzing audits for all model plans
var analyzeAuditCommand = &cobra.Command{
	Use:   "analyze",
	Short: "",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {

		fmt.Printf("Ran the Analyze Command with command : %s", cmd.Use)
		analyzeModelPlanForAnalyzedAudit()

	},
}

// analyzeModelPlanForAnalyzedAudit creates a seeder and analyzes all existing model plans
func analyzeModelPlanForAnalyzedAudit() {
	seeder := newDefaultSeeder(viperConfig)

	seeder.CreateAnalyzedAuditData()

}

// translateAuditsCommand is an entry point for analyzing audits for all model plans
var translateAuditsCommand = &cobra.Command{
	Use:   "translate",
	Short: "Converts Audits to translated audits",
	Long:  "This uses the humanized audit package to translate and flatten analyzed audits",
	Run: func(cmd *cobra.Command, args []string) {

		fmt.Printf("Ran the Humanize Command with command : %s", cmd.Use)
		minutes := 60
		if len(args) > 0 {
			minuteString := args[0]
			if minuteString != "" {
				if intValue, err := strconv.Atoi(minuteString); err == nil {
					minutes = intValue
				}

			}
		}

		humanizeModelPlanChanges(minutes)

	},
}

var queueAllTranslatedAuditChangesCommand = &cobra.Command{
	Use:   "queueTranslation",
	Short: "Enqueues all audit translations",

	Run: func(cmd *cobra.Command, args []string) {

		fmt.Printf("Ran the queue Translation command : %s", cmd.Use)
		seeder := newDefaultSeeder(viperConfig)
		seeder.queueAllTranslatedAuditChanges()
	},
}
var translateAllQueuedTranslatedAuditChangesCommand = &cobra.Command{
	Use:   "translateQueue",
	Short: "Translates all enqueued audit translation queue entries",

	Run: func(cmd *cobra.Command, args []string) {

		fmt.Printf("Ran the translate  Queue command : %s", cmd.Use)
		seeder := newDefaultSeeder(viperConfig)
		seeder.translateAllQueuedTranslatedAudits()
	},
}
var translateNextQueuedTranslatedAuditChangesCommand = &cobra.Command{
	Use:   "translateNextQueue",
	Short: "Translates next enqueued audit translation queue entries",

	Run: func(cmd *cobra.Command, args []string) {

		fmt.Printf("Ran the translate next Queued Translation command : %s", cmd.Use)
		seeder := newDefaultSeeder(viperConfig)
		seeder.translateNextQueuedTranslatedAudit()
	},
}
var queueAndProcessAllTranslatedAuditChangesCommand = &cobra.Command{
	Use:   "queueAndProcessTranslation",
	Short: "Enqueues and processes all audit translations",

	Run: func(cmd *cobra.Command, args []string) {

		fmt.Printf("Ran the queue Translation command : %s", cmd.Use)
		seeder := newDefaultSeeder(viperConfig)
		seeder.queueAndProcessAllTranslatedAuditQueueEntries()
	},
}

// humanizeModelPlanChanges humanizes all audit changes
func humanizeModelPlanChanges(minutes int) {
	seeder := newDefaultSeeder(viperConfig)

	seeder.HumanizeModelPlanChanges(minutes)

}

// HumanizeModelPlanChanges humanizes model plans for a give time range
func (s *Seeder) HumanizeModelPlanChanges(minutes int) {
	timeEnd := time.Now()
	timeStart := timeEnd.Add((time.Minute * -time.Duration(minutes)))

	// Step 1. Get all model plans
	modelPlans, err := s.Config.Store.ModelPlanCollection(s.Config.Logger, false)
	if err != nil {
		panic(fmt.Errorf("couldn't retrieve model plan collection"))
	}
	for _, plan := range modelPlans {
		_, err := translatedaudit.TranslateAuditsForModelPlan(s.Config.Context, s.Config.Store, s.Config.Logger, timeStart, timeEnd, plan.ID)
		if err != nil {
			fmt.Printf("issue humanizing audits for model plan '%s'. err %v", plan.ModelName, err)
		}
	}

}

// CreateAnalyzedAuditData uses the seeder to generate analyzed audits. It will make one record for all changes just seeded
func (s *Seeder) CreateAnalyzedAuditData() {
	dayToAnalyze := time.Now()

	// Step 1. Get all model plans
	modelPlans, err := s.Config.Store.ModelPlanCollection(s.Config.Logger, false)
	if err != nil {
		panic(fmt.Errorf("couldn't retrieve model plan collection"))
	}

	// Step 2. Iterate through all model plans, and generate analyzed audit data
	for _, mp := range modelPlans {
		_, err2 := resolvers.AnalyzeModelPlanForAnalyzedAudit(s.Config.Context, s.Config.Store, s.Config.Logger, dayToAnalyze, mp.ID)
		// Notice:  that this will create an error if you run this a second time, because there is already an analyzed audit record.
		// For simplicity, we check if it is that error, and if so just continue.
		if err2 != nil {
			if pqErr, ok := err2.(*pq.Error); ok {

				if pqErr.Code.Name() == "unique_violation" {
					continue
				}
				fmt.Printf("pq error: Severity: %s, Code: %s, Message: %s\n", pqErr.Severity, pqErr.Code, pqErr.Message)

			} else {
				fmt.Printf("there was an issue analyzing model plan: %s, ID: %s. Err: %v", mp.ModelName, mp.ID, err2)
			}

		}
	}

	// Step 4. Get all Users who have a favorited model (See worker.DigestEmailBatchJob in pkg/worker/digest_email_job.go)

	// Try to send the emails for the daily digest (which also generates a notification)
	userIDs, err := s.Config.Store.PlanFavoriteCollectionGetUniqueUserIDs()
	if err != nil {
		panic(fmt.Errorf("couldn't get user ids for users with plan favorites, %w", err))
	}
	preferenceFunctions := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		return storage.UserNotificationPreferencesGetByUserID(s.Config.Store, user_id)
	}
	for _, id := range userIDs {
		err := resolvers.DailyDigestNotificationSend(s.Config.Context, s.Config.Store, s.Config.Logger, dayToAnalyze, id, preferenceFunctions, s.Config.EmailService, s.Config.EmailTemplateService, s.Config.AddressBook)
		if err != nil {
			fmt.Printf("there was an issue sending digest emails for userID: %s", id)
		}
	}

}

func (s *Seeder) queueAllTranslatedAuditChanges() {

	arg := map[string]interface{}{}

	queued, _ := sqlutils.SelectProcedure[models.TranslatedAuditQueue](s.Config.Store, sqlqueries.TranslatedAuditQueue.DANGEROUSQueueAllEntries, arg)
	fmt.Printf("queued %d entries \r\n", len(queued))

}

func (s *Seeder) translateAllQueuedTranslatedAudits() {
	queuedObjects, err := storage.TranslatedAuditQueueGetQueued(s.Config.Store)
	if err != nil {
		fmt.Printf("issue getting queued Objects to translate \r\n")
	}

	for _, queued := range queuedObjects {
		translationErr := translatedaudit.TranslateAuditJobByID(s.Config.Context, s.Config.Store, s.Config.Logger, queued.ChangeID, queued.ID)
		if translationErr != nil {
			fmt.Println(fmt.Errorf("error getting queued objects to translate, %w", translationErr))
		}
	}
}

func (s *Seeder) translateNextQueuedTranslatedAudit() {
	queuedObjects, err := storage.TranslatedAuditQueueGetQueued(s.Config.Store)
	if err != nil {
		fmt.Printf("issue getting queued Objects to translate \r\n")
	}
	if len(queuedObjects) > 1 {
		queued := queuedObjects[0]
		translationErr := translatedaudit.TranslateAuditJobByID(s.Config.Context, s.Config.Store, s.Config.Logger, queued.ChangeID, queued.ID)
		if translationErr != nil {
			fmt.Println(fmt.Errorf("error getting queued objects to translate, %w ", translationErr))
		}
	}

}

func (s *Seeder) queueAndProcessAllTranslatedAuditQueueEntries() {
	s.queueAllTranslatedAuditChanges()
	s.translateAllQueuedTranslatedAudits()
}
