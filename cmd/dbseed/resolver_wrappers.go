package main

import (
	"context"
	"os"
	"path/filepath"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"go.uber.org/zap"

	"github.com/99designs/gqlgen/graphql"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"
)

// createModelPlan is a wrapper for resolvers.ModelPlanCreate
// It will panic if an error occurs, rather than bubbling the error up
func createModelPlan(store *storage.Store, logger *zap.Logger, modelName string, euaID string) *models.ModelPlan {

	princ := getTestPrincipal(store, euaID)
	plan, err := resolvers.ModelPlanCreate(context.Background(), logger, modelName, store, princ, userhelpers.GetUserInfoAccountInformationWrapperFunction(stubFetchUserInfo))
	if err != nil {
		panic(err)
	}
	return plan
}

// updateModelPlan is a wrapper for resolvers.ModelPlanUpdate
// It will panic if an error occurs, rather than bubbling the error up
// It will always update the model plan with the principal value of the Model Plan's "createdBy"
func updateModelPlan(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, changes map[string]interface{}) *models.ModelPlan {
	princ := getTestPrincipal(store, mp.CreatedBy)
	updated, err := resolvers.ModelPlanUpdate(logger, mp.ID, changes, princ, store)
	if err != nil {
		panic(err)
	}
	return updated
}

// updatePlanBasics is a wrapper for resolvers.PlanBasicsGetByModelPlanID and resolvers.UpdatePlanBasics
// It will panic if an error occurs, rather than bubbling the error up
// It will always update the Plan Basics object with the principal value of the Model Plan's "createdBy"
func updatePlanBasics(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, changes map[string]interface{}) *models.PlanBasics {
	princ := getTestPrincipal(store, mp.CreatedBy)

	basics, err := resolvers.PlanBasicsGetByModelPlanID(logger, mp.ID, store)
	if err != nil {
		panic(err)
	}

	updated, err := resolvers.UpdatePlanBasics(logger, basics.ID, changes, princ, store)
	if err != nil {
		panic(err)
	}
	return updated
}

func stubFetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	return &models.UserInfo{
		EuaUserID:  username,
		FirstName:  username,
		LastName:   "Doe",
		CommonName: username + " Doe",
		Email:      models.NewEmailAddress(username + ".doe@local.fake"),
	}, nil
}

// addPlanCollaborator is a wrapper for resolvers.CreatePlanCollaborator
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the collaborator object with the principal value of the Model Plan's "createdBy"
func addPlanCollaborator(
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	logger *zap.Logger,
	mp *models.ModelPlan,
	input *model.PlanCollaboratorCreateInput,
) *models.PlanCollaborator {
	princ := getTestPrincipal(store, mp.CreatedBy)

	collaborator, _, err := resolvers.CreatePlanCollaborator(
		context.Background(),
		logger,
		emailService,
		emailTemplateService,
		input,
		princ,
		store,
		true,
		userhelpers.GetUserInfoAccountInformationWrapperFunction(stubFetchUserInfo),
	)
	if err != nil {
		panic(err)
	}
	return collaborator
}

// crTdlCreate is a wrapper for resolvers.PlanCrTdlCreate
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the CR/TDL object with the principal value of the Model Plan's "createdBy"
func addCrTdl(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, input *model.PlanCrTdlCreateInput) *models.PlanCrTdl {
	princ := getTestPrincipal(store, mp.CreatedBy)

	collaborator, err := resolvers.PlanCrTdlCreate(logger, input, princ, store)
	if err != nil {
		panic(err)
	}
	return collaborator
}

// planDocumentCreate is a wrapper for resolvers.PlanDocumentCreate
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the document with the principal value of the Model Plan's "createdBy"
func planDocumentCreate(store *storage.Store, logger *zap.Logger, s3Client *upload.S3Client, mp *models.ModelPlan, fileName string, filePath string, contentType string, docType models.DocumentType, restricted bool, otherTypeDescription *string, optionalNotes *string, scanned bool, virusFound bool) *models.PlanDocument {
	princ := getTestPrincipal(store, mp.CreatedBy)

	path, err := filepath.Abs(filePath)
	if err != nil {
		panic(err)
	}
	file, err := os.Open(path) // #nosec
	if err != nil {
		panic(err)
	}
	fileStats, err := file.Stat()
	if err != nil {
		panic(err)
	}

	input := model.PlanDocumentInput{
		ModelPlanID: mp.ID,
		FileData: graphql.Upload{
			File:        file,
			Filename:    fileName,
			Size:        fileStats.Size(),
			ContentType: contentType,
		},
		DocumentType:         docType,
		Restricted:           restricted,
		OtherTypeDescription: otherTypeDescription,
		OptionalNotes:        optionalNotes,
	}
	document, err := resolvers.PlanDocumentCreate(logger, &input, princ, store, s3Client)
	if err != nil {
		panic(err)
	}

	if scanned {
		scanStatus := "CLEAN"
		if virusFound {
			scanStatus = "INFECTED"
		}
		err := s3Client.SetTagValueForKey(document.FileKey, "av-status", scanStatus)
		if err != nil {
			panic(err)
		}
	}

	return document
}

// getOperationalNeedsByModelPlanID is a wrapper for resolvers.PossibleOperationalNeedCollectionGet
// It will panic if an error occurs, rather than bubbling the error up
func getOperationalNeedsByModelPlanID(logger *zap.Logger, store *storage.Store, modelPlanID uuid.UUID) []*models.OperationalNeed {
	operationalNeeds, err := resolvers.OperationalNeedCollectionGetByModelPlanID(logger, modelPlanID, store)
	if err != nil {
		panic(err)
	}

	return operationalNeeds
}

// addOperationalSolution is a wrapper for resolvers.OperationalSolutionInsertOrUpdate
// It will panic if an error occurs, rather than bubbling the error up
func addOperationalSolution(
	store *storage.Store,
	logger *zap.Logger,
	mp *models.ModelPlan,
	operationalNeedID uuid.UUID,
	changes map[string]interface{},
) *models.OperationalSolution {
	principal := getTestPrincipal(store, mp.CreatedBy)

	operationalSolution, err := resolvers.OperationalSolutionInsertOrUpdate(
		logger,
		operationalNeedID,
		"FFS_COMPETENCY_CENTER",
		changes,
		principal,
		store,
	)

	if err != nil {
		panic(err)
	}
	return operationalSolution
}

// addPlanDocumentSolutionLinks is a wrapper for resolvers.PlanDocumentSolutionLinksCreate
// It will panic if an error occurs, rather than bubbling the error up
func addPlanDocumentSolutionLinks(
	logger *zap.Logger,
	store *storage.Store,
	mp *models.ModelPlan,
	solutionID uuid.UUID,
	documentIDs []uuid.UUID,
) []*models.PlanDocumentSolutionLink {

	principal := getTestPrincipal(store, mp.CreatedBy)

	planDocumentSolutionLinks, err := resolvers.PlanDocumentSolutionLinksCreate(
		logger,
		store,
		solutionID,
		documentIDs,
		principal,
	)

	if err != nil {
		panic(err)
	}
	return planDocumentSolutionLinks
}

func getTestPrincipal(store *storage.Store, userName string) *authentication.ApplicationPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), store, userName, true, false, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))

	princ := &authentication.ApplicationPrincipal{
		Username:          userName,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
		JobCodeMAC:        false,
		UserAccount:       userAccount,
	}
	return princ

}
