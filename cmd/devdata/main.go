package main

import (

	// _ "github.com/lib/pq" // required for postgres driver in sql
	"time"

	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
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

	userInfo := &models.UserInfo{
		CommonName: "mint Doe",
		Email:      "MINT@local.fake",
		EuaUserID:  "MINT",
	}

	createEmptyPlan(logger, store, userInfo)
	createPlanWithCollaborators(logger, store, userInfo)
	// createPlanInProgress(logger, store, userInfo)
	createPlanComplete(logger, store, userInfo)
	createPlanWithDiscussions(logger, store, userInfo)
}

func createEmptyPlan(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo) {
	_, err := resolvers.ModelPlanCreate(logger, "Empty Plan", store, userInfo)
	if err != nil {
		panic(err)
	}
}

func createPlanWithCollaborators(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo) {
	plan, err := resolvers.ModelPlanCreate(logger, "Plan With Collaborators", store, userInfo)
	if err != nil {
		panic(err)
	}
	pci := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		EuaUserID:   "BTAL",
		FullName:    "Betty Alpha",
		TeamRole:    models.TeamRoleLeadership,
	}
	_, err = resolvers.CreatePlanCollaborator(logger, pci, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}
}

// func createPlanComplete(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo) {
// TODO COPY FROM createPlanComplete
// }

func createPlanComplete(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo) {
	plan, err := resolvers.ModelPlanCreate(logger, "Complete Plan", store, userInfo)
	if err != nil {
		panic(err)
	}

	// Update the plan itself
	changes := map[string]interface{}{
		"modelCategory": models.MCAccountableCare,
		"cmsCenters":    []models.CMSCenter{models.CMSCenterForMedicare},
	}
	_, err = resolvers.ModelPlanUpdate(logger, plan.ID, changes, &userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}

	// Update the basics
	basics, err := resolvers.PlanBasicsGetByModelPlanID(logger, &userInfo.EuaUserID, plan.ID, store)
	if err != nil {
		panic(err)
	}
	changes = map[string]interface{}{
		"modelType":      models.MTVoluntary,
		"problem":        "The problem",
		"goal":           "The goal",
		"testInventions": "The interventions",
	}
	_, err = resolvers.UpdatePlanBasics(logger, basics.ID, changes, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}

	// Update the milestones
	milestones, err := resolvers.FetchPlanMilestonesByModelPlanID(logger, &userInfo.EuaUserID, plan.ID, store)
	if err != nil {
		panic(err)
	}
	changes = map[string]interface{}{
		"completeICIP":            time.Now(),
		"clearanceStarts":         time.Now(),
		"clearanceEnds":           time.Now(),
		"announced":               time.Now(),
		"applicationsStart":       time.Now(),
		"applicationsEnd":         time.Now(),
		"performancePeriodStarts": time.Now(),
		"performancePeriodEnds":   time.Now(),
		"wrapUpEnds":              time.Now(),
		"phasedIn":                true,
	}
	_, err = resolvers.UpdatePlanMilestones(logger, milestones.ID, changes, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}

	// Update the general characteristics
	generalCharacteristics, err := resolvers.FetchPlanGeneralCharacteristicsByModelPlanID(logger, userInfo.EuaUserID, plan.ID, store)
	if err != nil {
		panic(err)
	}
	changes = map[string]interface{}{
		"isNewModel":                            true,
		"resemblesExistingModel":                false,
		"hasComponentsOrTracks":                 false,
		"alternativePaymentModel":               true,
		"alternativePaymentModelTypes":          []model.AlternativePaymentModelType{model.AlternativePaymentModelTypeRegular, model.AlternativePaymentModelTypeMips},
		"careCoordinationInvolved":              false,
		"additionalServicesInvolved":            true,
		"additionalServicesInvolvedDescription": "Lots of additional services",
		"communityPartnersInvolved":             false,
		"geographiesTargeted":                   false,
		"participationOptions":                  false,
		"rulemakingRequired":                    true,
		"rulemakingRequiredDescription":         "Lots of rules",
		"waiversRequired":                       false,
	}
	_, err = resolvers.UpdatePlanGeneralCharacteristics(logger, generalCharacteristics.ID, changes, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}

	// Update the participants and providers
	// generalCharacteristics, err := resolvers.FetchPlanGeneralCharacteristicsByModelPlanID(logger, userInfo.EuaUserID, plan.ID, store)
	// if err != nil {
	// 	panic(err)
	// }
	// changes = map[string]interface{}{
	// 	"isNewModel":                            true,
	// 	"resemblesExistingModel":                false,
	// 	"hasComponentsOrTracks":                 false,
	// 	"alternativePaymentModel":               true,
	// 	"alternativePaymentModelTypes":          []model.AlternativePaymentModelType{model.AlternativePaymentModelTypeRegular, model.AlternativePaymentModelTypeMips},
	// 	"careCoordinationInvolved":              false,
	// 	"additionalServicesInvolved":            true,
	// 	"additionalServicesInvolvedDescription": "Lots of additional services",
	// 	"communityPartnersInvolved":             false,
	// 	"geographiesTargeted":                   false,
	// 	"participationOptions":                  false,
	// 	"rulemakingRequired":                    true,
	// 	"rulemakingRequiredDescription":         "Lots of rules",
	// 	"waiversRequired":                       false,
	// }
	// _, err = resolvers.UpdatePlanGeneralCharacteristics(logger, generalCharacteristics.ID, changes, userInfo.EuaUserID, store)
	// if err != nil {
	// 	panic(err)
	// }

	// Update the beneficiaries
	beneficiaries, err := resolvers.PlanBeneficiariesGetByModelPlanID(logger, userInfo.EuaUserID, plan.ID, store)
	if err != nil {
		panic(err)
	}
	changes = map[string]interface{}{
		"treatDualElligibleDifferent":   models.TriYes,
		"excludeCertainCharacteristics": models.TriTBD,
		"numberPeopleImpacted":          500,
		"estimateConfidence":            models.ConfidenceNotAtAll,
		"beneficiarySelectionFrequency": models.SelectionQuarterly,
		"beneficiaryOverlap":            models.OverlapYesNeedPolicies,
	}
	_, err = resolvers.PlanBeneficiariesUpdate(logger, beneficiaries.ID, changes, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}
}

func createPlanWithDiscussions(logger *zap.Logger, store *storage.Store, userInfo *models.UserInfo) {
	plan, err := resolvers.ModelPlanCreate(logger, "Plan With Discussions", store, userInfo)
	if err != nil {
		panic(err)
	}

	// Discussion 1: Unanswered
	unansweredDiscussionInput := &model.PlanDiscussionCreateInput{
		ModelPlanID: plan.ID,
		Content:     "Why will nobody answer this!?",
	}
	_, err = resolvers.CreatePlanDiscussion(logger, unansweredDiscussionInput, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}

	// Discussion 2: Answered
	answeredDiscussionInput := &model.PlanDiscussionCreateInput{
		ModelPlanID: plan.ID,
		Content:     "Can someone please answer this?",
	}
	answeredDiscussion, err := resolvers.CreatePlanDiscussion(logger, answeredDiscussionInput, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}

	answeredDiscussionReplyInput := &model.DiscussionReplyCreateInput{
		DiscussionID: answeredDiscussion.ID,
		Content:      "Sure thing! The answer is 42.",
		Resolution:   true,
	}
	_, err = resolvers.CreateDiscussionReply(logger, answeredDiscussionReplyInput, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}

	changes := map[string]interface{}{
		"status": models.DiscussionAnswered,
	}
	_, err = resolvers.UpdatePlanDiscussion(logger, answeredDiscussion.ID, changes, userInfo.EuaUserID, store)
	if err != nil {
		panic(err)
	}
}
