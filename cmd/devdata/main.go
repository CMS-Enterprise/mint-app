package main

import (
	"github.com/google/uuid"

	"github.com/lib/pq"
	// _ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/appconfig"
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
	ac := models.MCAccountableCare
	cms := models.CMSCenterForClinicalStandardsAndQuality

	inProgress := models.TaskInProgress
	voluntary := models.MTVoluntary
	mandatory := models.MTMandatory
	cat := models.MCPrimaryCareTransformation
	// models.ModelCategory

	makeModelPlan("Mrs. Mint", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("f11eb129-2c80-4080-9440-439cbe1a286f")
		p.ModelName = models.StringPointer("My excellent plan that I just initiated")

		p.ModelCategory = &cat
		p.CMSCenter = &cms
		p.CMMIGroup = pq.StringArray{"STATE_INNOVATIONS_GROUP", "POLICY_AND_PROGRAMS_GROUP"}

		p.CreatedBy = models.StringPointer("ABCD")
		p.ModifiedBy = models.StringPointer("ABCD")
	})
	makePlanCollaborator(uuid.MustParse("f11eb129-2c80-4080-9440-439cbe1a286f"), "MINT", logger, store, func(c *models.PlanCollaborator) {
		c.FullName = "Mr. Mint"
		c.TeamRole = models.TeamRoleModelLead
	})

	makePlanCollaborator(uuid.MustParse("f11eb129-2c80-4080-9440-439cbe1a286f"), "WJZZ", logger, store, func(c *models.PlanCollaborator) {
		c.FullName = "Steven Wade"
		c.TeamRole = models.TeamRoleModelTeam
	})

	makePlanCollaborator(uuid.MustParse("f11eb129-2c80-4080-9440-439cbe1a286f"), "ABCD", logger, store, func(c *models.PlanCollaborator) {
		c.FullName = "Betty Alpha"
		c.TeamRole = models.TeamRoleLeadership
	})

	makeModelPlan("Mr. Mint", logger, store)
	plan := makeModelPlan("Mrs. Mint", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab")
		p.ModelName = models.StringPointer("PM Butler's great plan")

		p.CMMIGroup = pq.StringArray{"POLICY_AND_PROGRAMS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"}

		p.CreatedBy = models.StringPointer("MINT")
		p.ModifiedBy = models.StringPointer("MINT")
	})
	makePlanCollaborator(uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab"), "MINT", logger, store, func(c *models.PlanCollaborator) {
		c.FullName = "Mr. Mint"
		c.TeamRole = models.TeamRoleModelLead
	})

	makePlanBasics(plan.ID, logger, store, func(b *models.PlanBasics) {
		b.ModelType = &mandatory
		b.ModelPlanID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab")
		b.Problem = models.StringPointer("There is not enough candy")
		b.TestInventions = models.StringPointer("The great candy machine")
		b.Note = models.StringPointer("The machine doesn't work yet")
		b.Status = inProgress

	})

	plan2 := makeModelPlan("Excellent Model", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("18624c5b-4c00-49a7-960f-ac6d8b2c58df")
		p.ModelName = models.StringPointer("Platonian ideal")

		p.ModelCategory = &ac
		p.CMSCenter = &cms
		p.CMMIGroup = pq.StringArray{"STATE_INNOVATIONS_GROUP", "POLICY_AND_PROGRAMS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"}

		p.CreatedBy = models.StringPointer("MINT")
		p.ModifiedBy = models.StringPointer("MINT")
	})

	makePlanBasics(plan2.ID, logger, store, func(b *models.PlanBasics) {
		b.ModelType = &voluntary
		b.ModelPlanID = uuid.MustParse("18624c5b-4c00-49a7-960f-ac6d8b2c58df")
		b.Problem = models.StringPointer("There is not enough candy")
		b.TestInventions = models.StringPointer("The great candy machine")
		b.Note = models.StringPointer("The machine doesn't work yet")
		b.Status = inProgress

	})

}

func makeModelPlan(modelName string, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.ModelPlan)) *models.ModelPlan {

	plan := models.ModelPlan{
		ModelName: &modelName,

		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
	}

	for _, cb := range callbacks {
		cb(&plan)
	}

	dbPlan, _ := store.ModelPlanCreate(logger, &plan)
	return dbPlan
}
func makePlanCollaborator(mpID uuid.UUID, euaID string, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.PlanCollaborator)) *models.PlanCollaborator {

	collab := models.PlanCollaborator{
		EUAUserID:   euaID,
		TeamRole:    models.TeamRoleModelTeam,
		FullName:    euaID,
		ModelPlanID: mpID,

		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
		CMSCenter:  models.CMSCMMI,
	}
	for _, cb := range callbacks {
		cb(&collab)
	}
	dbCollab, _ := store.PlanCollaboratorCreate(logger, &collab)
	return dbCollab
}

func makePlanBasics(uuid uuid.UUID, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.PlanBasics)) *models.PlanBasics {
	// ctx := appcontext.WithLogger(context.Background(), logger)
	status := models.TaskReady

	basics := models.PlanBasics{

		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
		Status:     status,
	}

	for _, cb := range callbacks {
		cb(&basics)
	}

	dbBasics, _ := store.PlanBasicsCreate(logger, &basics)
	return dbBasics
}
