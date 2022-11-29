package main

import (
	"context"
	"os"
	"path/filepath"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"go.uber.org/zap"

	"github.com/99designs/gqlgen/graphql"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/local"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"
)

// createModelPlan is a wrapper for resolvers.ModelPlanCreate
// It will panic if an error occurs, rather than bubbling the error up
func createModelPlan(store *storage.Store, logger *zap.Logger, modelName string, euaID string) *models.ModelPlan {
	localLDAP := local.NewCedarLdapClient(logger)
	userInfo, err := localLDAP.FetchUserInfo(context.TODO(), euaID)
	if err != nil {
		panic(err)
	}
	princ := &authentication.EUAPrincipal{
		EUAID:             userInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}
	plan, err := resolvers.ModelPlanCreate(logger, modelName, store, userInfo, princ)
	if err != nil {
		panic(err)
	}
	return plan
}

// updateModelPlan is a wrapper for resolvers.ModelPlanUpdate
// It will panic if an error occurs, rather than bubbling the error up
// It will always update the model plan with the principal value of the Model Plan's "createdBy"
func updateModelPlan(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, changes map[string]interface{}) *models.ModelPlan {
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}
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
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

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
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

	collaborator, err := resolvers.CreatePlanCollaborator(
		logger,
		emailService,
		emailTemplateService,
		input,
		princ,
		store,
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
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

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
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

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
	principal := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

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

	principal := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

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
