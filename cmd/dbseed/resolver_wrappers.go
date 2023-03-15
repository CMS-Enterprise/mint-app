package main

import (
	"context"
	"os"
	"path/filepath"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/99designs/gqlgen/graphql"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
)

// createModelPlan is a wrapper for resolvers.ModelPlanCreate
// It will panic if an error occurs, rather than bubbling the error up
func (s *Seeder) createModelPlan(
	modelName string,
	euaID string,
) *models.ModelPlan {

	princ := s.getTestPrincipalByUsername(euaID)
	plan, err := resolvers.ModelPlanCreate(
		context.Background(),
		s.Config.Logger,
		nil,
		nil,
		email.AddressBook{},
		modelName,
		s.Config.Store,
		princ,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(stubFetchUserInfo),
	)
	if err != nil {
		panic(err)
	}
	return plan
}

// updateModelPlan is a wrapper for resolvers.ModelPlanUpdate
// It will panic if an error occurs, rather than bubbling the error up
// It will always update the model plan with the principal value of the Model Plan's "createdBy"
func (s *Seeder) updateModelPlan(mp *models.ModelPlan, changes map[string]interface{}) *models.ModelPlan {
	princ := s.getTestPrincipalByUUID(mp.CreatedBy)
	updated, err := resolvers.ModelPlanUpdate(s.Config.Logger, mp.ID, changes, princ, s.Config.Store)
	if err != nil {
		panic(err)
	}
	return updated
}

// updatePlanBasics is a wrapper for resolvers.PlanBasicsGetByModelPlanID and resolvers.UpdatePlanBasics
// It will panic if an error occurs, rather than bubbling the error up
// It will always update the Plan Basics object with the principal value of the Model Plan's "createdBy"
func (s *Seeder) updatePlanBasics(mp *models.ModelPlan, changes map[string]interface{}) *models.PlanBasics {
	princ := s.getTestPrincipalByUUID(mp.CreatedBy)

	basics, err := resolvers.PlanBasicsGetByModelPlanID(s.Config.Logger, mp.ID, s.Config.Store)
	if err != nil {
		panic(err)
	}

	updated, err := resolvers.UpdatePlanBasics(s.Config.Logger, basics.ID, changes, princ, s.Config.Store)
	if err != nil {
		panic(err)
	}
	return updated
}

func stubFetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	return &models.UserInfo{
		Username:    username,
		FirstName:   username,
		LastName:    "Doe",
		DisplayName: username + " Doe",
		Email:       username + ".doe@local.fake",
	}, nil
}

// addPlanCollaborator is a wrapper for resolvers.CreatePlanCollaborator
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the collaborator object with the principal value of the Model Plan's "createdBy"
func (s *Seeder) addPlanCollaborator(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	mp *models.ModelPlan,
	input *model.PlanCollaboratorCreateInput,
) *models.PlanCollaborator {
	princ := s.getTestPrincipalByUUID(mp.CreatedBy)

	collaborator, _, err := resolvers.CreatePlanCollaborator(
		context.Background(),
		s.Config.Logger,
		emailService,
		emailTemplateService,
		email.AddressBook{},
		input,
		princ,
		s.Config.Store,
		true,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(stubFetchUserInfo),
	)
	if err != nil {
		panic(err)
	}
	return collaborator
}

// crTdlCreate is a wrapper for resolvers.PlanCrTdlCreate
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the CR/TDL object with the principal value of the Model Plan's "createdBy"
func (s *Seeder) addCrTdl(mp *models.ModelPlan, input *model.PlanCrTdlCreateInput) *models.PlanCrTdl {
	princ := s.getTestPrincipalByUUID(mp.CreatedBy)

	collaborator, err := resolvers.PlanCrTdlCreate(s.Config.Logger, input, princ, s.Config.Store)
	if err != nil {
		panic(err)
	}
	return collaborator
}

// planDocumentCreate is a wrapper for resolvers.PlanDocumentCreate
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the document with the principal value of the Model Plan's "createdBy"
func (s *Seeder) planDocumentCreate(mp *models.ModelPlan, fileName string, filePath string, contentType string, docType models.DocumentType, restricted bool, otherTypeDescription *string, optionalNotes *string, scanned bool, virusFound bool) *models.PlanDocument {
	princ := s.getTestPrincipalByUUID(mp.CreatedBy)

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
	document, err := resolvers.PlanDocumentCreate(s.Config.Logger, &input, princ, s.Config.Store, s.Config.S3Client)
	if err != nil {
		panic(err)
	}

	if scanned {
		scanStatus := "CLEAN"
		if virusFound {
			scanStatus = "INFECTED"
		}
		err := s.Config.S3Client.SetTagValueForKey(document.FileKey, "av-status", scanStatus)
		if err != nil {
			panic(err)
		}
	}

	return document
}

// getOperationalNeedsByModelPlanID is a wrapper for resolvers.PossibleOperationalNeedCollectionGet
// It will panic if an error occurs, rather than bubbling the error up
func (s *Seeder) getOperationalNeedsByModelPlanID(modelPlanID uuid.UUID) []*models.OperationalNeed {
	operationalNeeds, err := resolvers.OperationalNeedCollectionGetByModelPlanID(s.Config.Logger, modelPlanID, s.Config.Store)
	if err != nil {
		panic(err)
	}

	return operationalNeeds
}

// addOperationalSolution is a wrapper for resolvers.OperationalSolutionCreate
// It will panic if an error occurs, rather than bubbling the error up
func (s *Seeder) addOperationalSolution(

	mp *models.ModelPlan,
	operationalNeedID uuid.UUID,
	changes map[string]interface{},
) *models.OperationalSolution {
	principal := s.getTestPrincipalByUUID(mp.CreatedBy)
	solType := models.OpSKMarx

	operationalSolution, err := resolvers.OperationalSolutionCreate(
		s.Config.Logger,
		operationalNeedID,
		&solType,
		changes,
		principal,
		s.Config.Store,
	)

	if err != nil {
		panic(err)
	}
	return operationalSolution
}

// addPlanDocumentSolutionLinks is a wrapper for resolvers.PlanDocumentSolutionLinksCreate
// It will panic if an error occurs, rather than bubbling the error up
func (s *Seeder) addPlanDocumentSolutionLinks(

	mp *models.ModelPlan,
	solutionID uuid.UUID,
	documentIDs []uuid.UUID,
) []*models.PlanDocumentSolutionLink {

	principal := s.getTestPrincipalByUUID(mp.CreatedBy)

	planDocumentSolutionLinks, err := resolvers.PlanDocumentSolutionLinksCreate(
		s.Config.Logger,
		s.Config.Store,
		solutionID,
		documentIDs,
		principal,
	)

	if err != nil {
		panic(err)
	}
	return planDocumentSolutionLinks
}

func (s *Seeder) getTestPrincipalByUsername(userName string) *authentication.ApplicationPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), s.Config.Store, userName, true, false, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))

	princ := &authentication.ApplicationPrincipal{
		Username:          userName,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
		JobCodeMAC:        false,
		UserAccount:       userAccount,
	}
	return princ

}

func (s *Seeder) getTestPrincipalByUUID(userID uuid.UUID) *authentication.ApplicationPrincipal {

	userAccount, _ := userhelpers.UserAccountGetByIDLOADER(s.Config.Context, userID)
	princ := &authentication.ApplicationPrincipal{
		Username:          *userAccount.Username,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
		JobCodeMAC:        false,
		UserAccount:       userAccount,
	}
	return princ

}

// operationalSolutionSubtasksCreate is a wrapper for resolvers.OperationalSolutionSubtasksCreate
// It will panic if an error occurs, rather than bubbling the error up
func (s *Seeder) operationalSolutionSubtasksCreate(
	mp *models.ModelPlan,
	solutionID uuid.UUID,
	inputs []*model.CreateOperationalSolutionSubtaskInput,
) []*models.OperationalSolutionSubtask {

	principal := s.getTestPrincipalByUUID(mp.CreatedBy)

	subtasks, err := resolvers.OperationalSolutionSubtasksCreate(
		s.Config.Logger,
		s.Config.Store,
		inputs,
		solutionID,
		principal,
	)

	if err != nil {
		panic(err)
	}
	return subtasks
}
