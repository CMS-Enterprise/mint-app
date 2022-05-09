package main

import (
	"github.com/google/uuid"

	"time"

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
		p.Status = models.ModelStatusPlanDraft

		p.ModelCategory = &cat
		p.CMSCenters = pq.StringArray{string(models.CMSCenterForMedicare), string(models.CMSOther)}
		p.CMSOther = models.StringPointer("The Center for Awesomeness ")
		p.CMMIGroups = pq.StringArray{"STATE_INNOVATIONS_GROUP", "POLICY_AND_PROGRAMS_GROUP"}

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
	pmGreatPlan := makeModelPlan("Mrs. Mint", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("6e224030-09d5-46f7-ad04-4bb851b36eab")
		p.ModelName = models.StringPointer("PM Butler's great plan")
		p.Status = models.ModelStatusPlanDraft

		p.CMMIGroups = pq.StringArray{"POLICY_AND_PROGRAMS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"}

		p.CreatedBy = models.StringPointer("MINT")
		p.ModifiedBy = models.StringPointer("MINT")
	})
	makePlanCollaborator(pmGreatPlan.ID, "MINT", logger, store, func(c *models.PlanCollaborator) {
		c.FullName = "Mr. Mint"
		c.TeamRole = models.TeamRoleModelLead
	})

	makePlanBasics(pmGreatPlan.ID, logger, store, func(b *models.PlanBasics) {
		b.ModelType = &mandatory

		b.Problem = models.StringPointer("There is not enough candy")
		b.TestInventions = models.StringPointer("The great candy machine")
		b.Note = models.StringPointer("The machine doesn't work yet")
		b.Status = inProgress

	})

	makePlanMilestones(pmGreatPlan.ID, logger, store, func(m *models.PlanMilestones) {
		now := time.Now()
		phased := false
		m.CompleteICIP = &now
		m.ClearanceStarts = &now
		m.ClearanceEnds = &now
		m.Announced = &now
		m.ApplicationsStart = &now
		m.ApplicationsEnd = &now
		m.PerformancePeriodStarts = &now
		m.PerformancePeriodEnds = &now
		m.WrapUpEnds = &now
		m.HighLevelNote = models.StringPointer("Theses are my  best guess notes")
		m.PhasedIn = &phased
		m.PhasedInNote = models.StringPointer("This can't be phased in")

	})

	pmGreatDiscuss := makePlanDiscussion(pmGreatPlan.ID, logger, store, func(pd *models.PlanDiscussion) {
		pd.Content = "What is the purpose of this plan?"
		pd.Status = models.DiscussionAnswered
		pd.CreatedBy = "JAKE"
		pd.ModifiedBy = "JAKE"

	})

	makeDiscussionReply(pmGreatDiscuss.ID, logger, store, func(d *models.DiscussionReply) {
		d.Content = "To make more candy"
		d.Resolution = true
		d.CreatedBy = "FINN"
		d.ModifiedBy = "FINN"

	})

	plan2 := makeModelPlan("Excellent Model", logger, store, func(p *models.ModelPlan) {
		p.ID = uuid.MustParse("18624c5b-4c00-49a7-960f-ac6d8b2c58df")
		p.ModelName = models.StringPointer("Platonian ideal")
		p.Status = models.ModelStatusPlanDraft

		p.ModelCategory = &ac
		p.CMSCenters = pq.StringArray{string(cms)}
		p.CMMIGroups = pq.StringArray{"STATE_INNOVATIONS_GROUP", "POLICY_AND_PROGRAMS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"}

		p.CreatedBy = models.StringPointer("MINT")
		p.ModifiedBy = models.StringPointer("MINT")
	})

	makePlanBasics(plan2.ID, logger, store, func(b *models.PlanBasics) {
		b.ModelType = &voluntary
		b.Problem = models.StringPointer("There is not enough candy")
		b.TestInventions = models.StringPointer("The great candy machine")
		b.Note = models.StringPointer("The machine doesn't work yet")
		b.Status = inProgress
	})

	makePlanMilestones(plan2.ID, logger, store, func(m *models.PlanMilestones) {
		now := time.Now()
		phased := true
		m.CompleteICIP = &now
		m.ClearanceStarts = &now
		m.ClearanceEnds = &now
		m.Announced = &now
		m.ApplicationsStart = &now
		m.ApplicationsEnd = &now
		m.PerformancePeriodStarts = &now
		m.PerformancePeriodEnds = &now
		m.WrapUpEnds = &now
		m.HighLevelNote = models.StringPointer("Theses are my  best guess notes")
		m.PhasedIn = &phased
		m.PhasedInNote = models.StringPointer("This will be phased in")

	})

	/*
		s3Config := upload.Config{Bucket: "mint-test-bucket", Region: "us-west", IsLocal: true}
		s3Client := upload.NewS3Client(s3Config)

		documentType := models.DocumentTypeOther
		planDocumentInput := model.PlanDocumentInput{
			ModelPlanID: uuid.MustParse("18624c5b-4c00-49a7-960f-ac6d8b2c58df"),
			DocumentParameters: &model.PlanDocumentParameters{
				FileName:             models.StringPointer("FAKE.pdf"),
				FileSize:             512512,
				FileType:             models.StringPointer("application/pdf"),
				DocumentType:         &documentType,
				OtherTypeDescription: models.StringPointer("A fake document"),
			},
			URL: models.StringPointer("http://minio:9000/mint-app-file-uploads/8bitshades.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=L31LSFLREORA0BKZ704N%2F20220504%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220504T045241Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJMMzFMU0ZMUkVPUkEwQktaNzA0TiIsImV4cCI6MTY1MTY0Mjg2NiwicGFyZW50IjoibWluaW9hZG1pbiJ9.IM5OhdYOz5yqby2aTg4O9aABjlA0hjIIWiZNduDp5eRwqxCnEpf3kf77uLDUFKvebMI01KArTFmHQii8qMjAxQ&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=050aef69d3dab5e4e297ec942d33506a2e890989fc3cc537bae95c99b3297d1a"),
		}

		inputDocument := graph.ConvertToPlanDocumentModel(&planDocumentInput)

		makePlanDocument(logger, store, &s3Client, models.StringPointer("FAKE"), inputDocument, planDocumentInput.URL, func(d *models.PlanDocument) {})
	*/
}

func makeModelPlan(modelName string, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.ModelPlan)) *models.ModelPlan {
	status := models.ModelStatusPlanDraft

	plan := models.ModelPlan{
		ModelName: &modelName,
		Archived:  false,

		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
		Status:     status,
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
		ModelPlanID: uuid,
		CreatedBy:   models.StringPointer("ABCD"),
		ModifiedBy:  models.StringPointer("ABCD"),
		Status:      status,
	}

	for _, cb := range callbacks {
		cb(&basics)
	}

	dbBasics, _ := store.PlanBasicsCreate(logger, &basics)
	return dbBasics
}

/*func makePlanDocument(
	logger *zap.Logger,
	store *storage.Store,
	s3Client *upload.S3Client,
	principal *string,
	inputDocument *models.PlanDocument,
	inputURL *string,
	callbacks ...func(basics *models.PlanDocument)) *model.PlanDocumentPayload {

	document, err := store.PlanDocumentCreate(logger, principal, inputDocument, inputURL, s3Client)
	if err != nil {
		panic(fmt.Sprintf("Error - Could not create plan document: %v", err))
	}

	for _, callback := range callbacks {
		callback(document)
	}

	presignedURL, urlErr := s3Client.NewGetPresignedURL(*document.FileKey)
	if urlErr != nil {
		panic(fmt.Sprintf("Error - Could not create plan document presigned url: %v", urlErr))
	}

	payload := model.PlanDocumentPayload{
		Document:     document,
		PresignedURL: presignedURL,
	}

	return &payload
}*/

func makePlanDiscussion(uuid uuid.UUID, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.PlanDiscussion)) *models.PlanDiscussion {
	discussion := models.PlanDiscussion{
		ModelPlanID: uuid,
		Content:     "This is a test comment",
		Status:      models.DiscussionUnAnswered,
		CreatedBy:   "ABCD",
		ModifiedBy:  "ABCD",
	}

	for _, cb := range callbacks {
		cb(&discussion)
	}

	dbDiscuss, _ := store.PlanDiscussionCreate(logger, &discussion)
	return dbDiscuss

}

func makeDiscussionReply(uuid uuid.UUID, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.DiscussionReply)) *models.DiscussionReply {

	reply := models.DiscussionReply{
		DiscussionID: uuid,
		Content:      "This is a test reply",
		Resolution:   false,
		CreatedBy:    "ABCD",
		ModifiedBy:   "ABCD",
	}

	for _, cb := range callbacks {
		cb(&reply)
	}

	dbReply, _ := store.DiscussionReplyCreate(logger, &reply)
	return dbReply

}

func makePlanMilestones(uuid uuid.UUID, logger *zap.Logger, store *storage.Store, callbacks ...func(*models.PlanMilestones)) *models.PlanMilestones {

	milestones := models.PlanMilestones{
		ModelPlanID: uuid,
		// CompleteICIP: ,

		// ClearanceStarts: ,
		// ClearanceEnds: ,
		// Announced: ,
		// ApplicationsStart: ,
		// ApplicationsEnd: ,
		// PerformancePeriodStarts: ,
		// PerformancePeriodEnds: ,
		// WrapUpEnds: ,
		// HighLevelNote: ,
		// PhasedIn: ,
		// PhasedInNote: ,
		CreatedBy:  models.StringPointer("ABCD"),
		ModifiedBy: models.StringPointer("ABCD"),
		Status:     models.TaskReady,
	}

	for _, cb := range callbacks {
		cb(&milestones)
	}

	dbmilestones, _ := store.PlanMilestonesCreate(logger, &milestones)
	return dbmilestones

}
