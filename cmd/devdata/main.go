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
	makeModelPlan("Mrs. Mint", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab")
		p.ModelName = models.StringPointer("PM Butler's great plan")
		p.ModelCategory = models.StringPointer("Good ideas")
		p.CMSCenter = models.StringPointer("Center for Awesomeness")
		p.CMMIGroup = models.StringPointer("Great Group")

		// p.MainPointOfContact = models.StringPointer("PM Butler")
		// p.PointOfContactComponent = models.StringPointer("Center for Awesomeness")
		p.CreatedBy = models.StringPointer("MINT")
		p.ModifiedBy = models.StringPointer("MINT")
	})

}

func makeModelPlan(modelName string, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.ModelPlan)) *models.ModelPlan {
	ctx := appcontext.WithLogger(context.Background(), logger)

	//now := time.Now()
	plan := models.ModelPlan{
		ModelName:     &modelName,
		ModelCategory: models.StringPointer("Normal ideas"),
		CMSCenter:     models.StringPointer("Center for Medicaid and CHIP Services"),
		CMMIGroup:     models.StringPointer("Innovation Group"),
		// Requester:               models.StringPointer(requester),
		// RequesterComponent:      models.StringPointer("Center for Medicaid and CHIP Services"),
		// MainPointOfContact:      models.StringPointer("Mr. POC"),
		// PointOfContactComponent: models.StringPointer("Center for Medicaid and CHIP Services"),
		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
	}

	for _, cb := range callbacks {
		cb(&plan)
	}

	store.ModelPlanCreate(ctx, &plan)
	return &plan
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
