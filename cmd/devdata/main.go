package main

import (
	"context"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/testhelpers"
)

func main() {
	config := testhelpers.NewConfig()
	logger, loggerErr := zap.NewDevelopment()
	if loggerErr != nil {
		panic(loggerErr)
	}

	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	ldClient, ldErr := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if ldErr != nil {
		panic(ldErr)
	}

	store, storeErr := storage.NewStore(logger, dbConfig, ldClient)
	if storeErr != nil {
		panic(storeErr)
	}
	makeModelPlan("Mr. Mint", logger, store)
	plan := makeModelPlan("Mrs. Mint", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab")
		p.ModelName = models.StringPointer("PM Butler's great plan")

		//TOOD update test data to use ENUM
		// p.ModelCategory = models.StringPointer("Good ideas")
		// p.CMSCenter = models.StringPointer("Center for Awesomeness")
		// p.CMMIGroup = models.StringPointer("Great Group")

		p.CreatedBy = models.StringPointer("MINT")
		p.ModifiedBy = models.StringPointer("MINT")
	})
	inProgress := models.TaskInProgress

	makePlanBasics(plan.ID, logger, store, func(b *models.PlanBasics) {
		// b.ID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36epb")
		b.Problem = models.StringPointer("There is not enough candy")
		b.TestInventions = models.StringPointer("The great candy machine")
		b.Note = models.StringPointer("The machine doesn't work yet")
		b.Status = &inProgress

	})

	ac := models.MCAccountableCare
	cms := models.CMSCenterForClinicalStandardsAndQuality

	plan2 := makeModelPlan("Excellent Model", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("18624c5b-4c00-49a7-960f-ac6d8b2c58df")
		p.ModelName = models.StringPointer("Platonian ideala")

		p.ModelCategory = &ac
		p.CMSCenter = &cms
		// p.CMMIGroup = models.StringPointer("Great Group")

		p.CreatedBy = models.StringPointer("MINT")
		p.ModifiedBy = models.StringPointer("MINT")
	})

	makePlanBasics(plan2.ID, logger, store, func(b *models.PlanBasics) {
		// b.ID = uuid.MustParse("7e224030-09d5-46f7-ad04-4bb851b36epb")
		b.Problem = models.StringPointer("There is not enough candy")
		b.TestInventions = models.StringPointer("The great candy machine")
		b.Note = models.StringPointer("The machine doesn't work yet")
		b.Status = &inProgress

	})

}

func makeModelPlan(modelName string, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.ModelPlan)) *models.ModelPlan {
	ctx := appcontext.WithLogger(context.Background(), logger)

	plan := models.ModelPlan{
		ModelName: &modelName,
		//TODO update!
		// ModelCategory: models.StringPointer("Normal ideas"),
		// CMSCenter:     models.StringPointer("Center for Medicaid and CHIP Services"),
		// CMMIGroup:     models.StringPointer("Innovation Group"),
		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
	}

	for _, cb := range callbacks {
		cb(&plan)
	}

	store.ModelPlanCreate(ctx, &plan)
	return &plan
}
func makePlanBasics(uuid uuid.UUID, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.PlanBasics)) *models.PlanBasics {
	// ctx := appcontext.WithLogger(context.Background(), logger)
	status := models.TaskReady

	basics := models.PlanBasics{

		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
		Status:     &status,
	}

	for _, cb := range callbacks {
		cb(&basics)
	}
	// principal := appcontext.Principal(ctx).ID()

	store.PlanBasicsCreate(logger, &basics)
	return &basics
}

func must(_ interface{}, err error) {
	if err != nil {
		panic(err)
	}
}

func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}
