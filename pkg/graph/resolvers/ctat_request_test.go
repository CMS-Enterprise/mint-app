package resolvers

import (
	"bytes"
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/emailtestconfigs"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

func (suite *ResolverSuite) TestCTATRequestByRequesterIDLoader() {
	requesterA := suite.testConfigs.Principal.Account().ID
	requesterBPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "BTAL")
	requesterB := requesterBPrincipal.Account().ID
	requesterCPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "JANE")
	requesterC := requesterCPrincipal.Account().ID
	now := time.Now().UTC()

	firstA := suite.createTestCTATRequest(
		requesterA,
		now.Add(24*time.Hour),
		"Requester A contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	secondA := suite.createTestCTATRequest(
		requesterA,
		now.Add(48*time.Hour),
		"Requester A contract 2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ},
		models.CTATStatusAssigned,
	)
	firstB := suite.createTestCTATRequest(
		requesterB,
		now.Add(72*time.Hour),
		"Requester B contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusClosed,
	)

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, []uuid.UUID]{
		{Key: requesterA, Expected: []uuid.UUID{firstA.ID, secondA.ID}},
		{Key: requesterB, Expected: []uuid.UUID{firstB.ID}},
		{Key: requesterC, Expected: []uuid.UUID{}},
	}

	verifyFunc := func(data []*models.CTATRequest, expected []uuid.UUID) bool {
		returnedIDs := lo.Map(data, func(item *models.CTATRequest, _ int) uuid.UUID {
			return item.ID
		})
		return suite.ElementsMatch(expected, returnedIDs)
	}

	loaders.VerifyLoaders[uuid.UUID, []*models.CTATRequest, []uuid.UUID](
		suite.testConfigs.Context,
		&suite.Suite,
		loaders.CTATRequest.ByRequesterID,
		expectedResults,
		verifyFunc,
	)
}

func (suite *ResolverSuite) TestCTATRequestByIDLoader() {
	now := time.Now().UTC()

	requestA := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"Requester A contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	requestB := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(48*time.Hour),
		"Requester B contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ},
		models.CTATStatusAssigned,
	)

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, uuid.UUID]{
		{Key: requestA.ID, Expected: requestA.ID},
		{Key: requestB.ID, Expected: requestB.ID},
	}

	verifyFunc := func(data *models.CTATRequest, expected uuid.UUID) bool {
		if suite.NotNil(data) {
			return suite.Equal(expected, data.ID)
		}
		return false
	}

	loaders.VerifyLoaders[uuid.UUID, *models.CTATRequest, uuid.UUID](
		suite.testConfigs.Context,
		&suite.Suite,
		loaders.CTATRequest.GetByID,
		expectedResults,
		verifyFunc,
	)
}

func (suite *ResolverSuite) TestCtatRequestsAdmin() {
	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	suite.True(adminPrincipal.AllowASSESSMENT())
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)
	now := time.Now().UTC()

	first := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"Admin contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	second := suite.createTestCTATRequest(
		suite.getTestPrincipal(suite.testConfigs.Store, "BTMN").Account().ID,
		now.Add(48*time.Hour),
		"Admin contract 2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusAssigned,
	)

	resp, err := CTATRequestCollectionGetForAdmin(adminCtx, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Len(resp, 2)

	returnedIDs := lo.Map(resp, func(item *models.CTATRequest, _ int) uuid.UUID {
		return item.ID
	})
	suite.ElementsMatch([]uuid.UUID{first.ID, second.ID}, returnedIDs)
}

func (suite *ResolverSuite) TestCtatRequest() {
	now := time.Now().UTC()

	request := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"Detail contract",
		[]models.CTATHelpNeededType{
			models.CTATHelpNeededTypeRequestForInformationRFI,
			models.CTATHelpNeededTypeRequestForQuotationRFQ,
		},
		models.CTATStatusAssigned,
	)

	resp, err := CTATRequestGetByID(suite.testConfigs.Context, request.ID)
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Equal(request.ID, resp.ID)
	suite.Equal(request.Requester, resp.Requester)
	suite.Equal(request.HumanReadableIDNumber, resp.HumanReadableIDNumber)
	suite.Equal(request.ContractName, resp.ContractName)
	suite.Equal([]models.CTATHelpNeededType(request.TypeOfHelpNeeded), []models.CTATHelpNeededType(resp.TypeOfHelpNeeded))
	suite.Equal(models.CTATStatusAssigned, resp.Status)
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestUpdatesStatusAssignedAdminAndNotes() {
	now := time.Now().UTC()

	request := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"Admin update contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	status := models.CTATStatusAssigned
	assignedAdmin := "ADMI"
	notes := "Assigned to CTAT admin during resolver test."

	resp, err := CTATRequestAdminUpdate(adminCtx, suite.testConfigs.Logger, request.ID, map[string]any{
		"status":        &status,
		"assignedAdmin": &assignedAdmin,
		"notes":         &notes,
	}, adminPrincipal, suite.testConfigs.Store, nil, email.AddressBook{}, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Equal(models.CTATStatusAssigned, resp.Status)
	suite.Require().NotNil(resp.AssignedAdmin)
	suite.Equal(adminPrincipal.Account().ID, *resp.AssignedAdmin)

	suite.Require().NotNil(resp.Notes)
	suite.Equal(notes, *resp.Notes)

	reloaded, err := CTATRequestGetByID(suite.testConfigs.Context, request.ID)
	suite.NoError(err)
	suite.NotNil(reloaded)
	suite.Equal(models.CTATStatusAssigned, reloaded.Status)
	suite.Require().NotNil(reloaded.AssignedAdmin)
	suite.Equal(adminPrincipal.Account().ID, *reloaded.AssignedAdmin)

	suite.Require().NotNil(reloaded.Notes)
	suite.Equal(notes, *reloaded.Notes)
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestClearsAssignedAdmin() {
	now := time.Now().UTC()

	request := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"Admin clear contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusAssigned,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	assignedAdmin := "ADMI"
	_, err := CTATRequestAdminUpdate(adminCtx, suite.testConfigs.Logger, request.ID, map[string]any{
		"assignedAdmin": &assignedAdmin,
	}, adminPrincipal, suite.testConfigs.Store, nil, email.AddressBook{}, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.Require().NoError(err)

	var noAssignedAdmin *string

	resp, err := CTATRequestAdminUpdate(adminCtx, suite.testConfigs.Logger, request.ID, map[string]any{
		"assignedAdmin": noAssignedAdmin,
	}, adminPrincipal, suite.testConfigs.Store, nil, email.AddressBook{}, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Nil(resp.AssignedAdmin)

	reloaded, err := CTATRequestGetByID(suite.testConfigs.Context, request.ID)
	suite.NoError(err)
	suite.NotNil(reloaded)
	suite.Nil(reloaded.AssignedAdmin)
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestUpdatesResolution() {
	now := time.Now().UTC()

	request := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"Admin resolution contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusInProgress,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	resolution := "Resolved during resolver-layer admin update test."

	resp, err := CTATRequestAdminUpdate(adminCtx, suite.testConfigs.Logger, request.ID, map[string]any{
		"resolution": &resolution,
	}, adminPrincipal, suite.testConfigs.Store, nil, email.AddressBook{}, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Require().NotNil(resp.Resolution)
	suite.Equal(resolution, *resp.Resolution)

	reloaded, err := CTATRequestGetByID(suite.testConfigs.Context, request.ID)
	suite.NoError(err)
	suite.NotNil(reloaded)
	suite.Require().NotNil(reloaded.Resolution)
	suite.Equal(resolution, *reloaded.Resolution)
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestReturnsErrorForUnknownAssignedAdminUsername() {
	now := time.Now().UTC()

	request := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"Admin unknown user contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	assignedAdmin := "NOT_A_REAL_EUA"

	unknownUserFetch := func(_ context.Context, _ string) (*models.UserInfo, error) {
		return nil, fmt.Errorf("user not found in okta")
	}

	resp, err := CTATRequestAdminUpdate(adminCtx, suite.testConfigs.Logger, request.ID, map[string]any{
		"assignedAdmin": &assignedAdmin,
	}, adminPrincipal, suite.testConfigs.Store, nil, email.AddressBook{}, userhelpers.GetUserInfoAccountInfoWrapperFunc(unknownUserFetch))
	suite.Nil(resp)
	suite.ErrorContains(err, "failed to get user account by username NOT_A_REAL_EUA")
}

func (suite *ResolverSuite) TestCTATRequestRelatedMINTModels() {
	now := time.Now().UTC()

	firstPlan := suite.createModelPlan("CTAT Related Model A")
	secondPlan := suite.createModelPlan("CTAT Related Model B")

	contractName := "Requester contract"
	request, err := CTATRequestCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		&model.CTATRequestInput{
			CmmiGroup:              models.CTATCMMIGroupOptionBSG,
			CmmiDivision:           new(models.CTATCMMIDivisionOptionBSGDBOM),
			RelatedMINTModels:      []uuid.UUID{firstPlan.ID, secondPlan.ID},
			ContractName:           &contractName,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
			DescribeHelpNeeded:     "Need help validating related CTAT models.",
			RequestUrgency:         models.CTATRequestUrgencyHigh,
			DateAssistanceNeededBy: now.Add(24 * time.Hour),
			SupportingDocuments:    []*model.CTATRequestDocumentInput{},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	suite.NotNil(request)

	relatedModels, err := CTATRelatedMINTModelsGetByCTATRequestIDLOADER(suite.testConfigs.Context, request.ID)
	suite.NoError(err)
	suite.Len(relatedModels, 2)
	suite.ElementsMatch([]uuid.UUID{firstPlan.ID, secondPlan.ID}, lo.Map(relatedModels, func(item *models.ModelPlan, _ int) uuid.UUID {
		return item.ID
	}))
}

func (suite *ResolverSuite) TestCTATRequestCreate() {
	relatedPlan := suite.createModelPlan("CTAT Create Related Plan")
	reader := bytes.NewReader([]byte("Some test CTAT file contents"))
	now := time.Now().UTC()

	contractName := "CTAT Create Contract"
	input := &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           new(models.CTATCMMIDivisionOptionBSGDBOM),
		RelatedMINTModels:      []uuid.UUID{relatedPlan.ID},
		ContractName:           &contractName,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		DescribeHelpNeeded:     "Need help creating a CTAT request.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.Add(24 * time.Hour),
		SupportingDocuments: []*model.CTATRequestDocumentInput{
			{
				FileData: graphql.Upload{
					File:        reader,
					Filename:    "ctat-request-upload.txt",
					Size:        reader.Size(),
					ContentType: "text/plain",
				},
			},
		},
	}

	created, err := CTATRequestCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	suite.NotNil(created)
	suite.Equal(models.CTATStatusNew, created.Status)
	suite.Equal(suite.testConfigs.Principal.Account().ID, created.Requester)
	suite.Require().NotNil(created.ContractName)
	suite.Equal(contractName, *created.ContractName)
	suite.Greater(created.HumanReadableIDNumber, 0)

	reloaded, err := CTATRequestGetByID(suite.testConfigs.Context, created.ID)
	suite.NoError(err)
	suite.NotNil(reloaded)
	suite.Equal(models.CTATStatusNew, reloaded.Status)
	suite.Equal(suite.testConfigs.Principal.Account().ID, reloaded.Requester)
	suite.Require().NotNil(reloaded.ContractName)
	suite.Equal(contractName, *reloaded.ContractName)

	relatedModels, err := CTATRelatedMINTModelsGetByCTATRequestIDLOADER(suite.testConfigs.Context, reloaded.ID)
	suite.NoError(err)
	suite.Len(relatedModels, 1)
	suite.Equal(relatedPlan.ID, relatedModels[0].ID)

	documents, err := CTATRequestDocumentGetByCTATRequestIDLOADER(suite.testConfigs.Context, reloaded.ID)
	suite.NoError(err)
	suite.Len(documents, 1)
	suite.Equal("ctat-request-upload.txt", documents[0].FileName)
	suite.Equal("text/plain", documents[0].FileType)
	suite.False(documents[0].Restricted)
}

func (suite *ResolverSuite) TestBuildCTATSubmittedBodyContentFormatsOtherValues() {
	emailService, err := oddmail.NewGoSimpleMailService(emailtestconfigs.TestEmailServiceConfig)
	suite.Require().NoError(err)
	now := time.Now().UTC()

	contractActivityType := models.CTATContractActivityTypeOther
	contractType := models.CTATContractTypeOther
	cmmiDivisionOther := models.CTATCMMIDivisionOptionOther

	createdGroupOtherRequest, err := CTATRequestCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		&model.CTATRequestInput{
			CmmiGroup:                 models.CTATCMMIGroupOptionOther,
			CmmiGroupOther:            new("Cross-CMMI Strategic Operations"),
			ContractActivityType:      &contractActivityType,
			ContractActivityTypeOther: new("Acquisition strategy support"),
			ContractType:              &contractType,
			ContractTypeOther:         new("Blanket Purchase Agreement"),
			TypeOfHelpNeeded: []models.CTATHelpNeededType{
				models.CTATHelpNeededTypeRequestForInformationRFI,
				models.CTATHelpNeededTypeOther,
			},
			TypeOfHelpNeededOther:  new("Assistance drafting evaluation criteria for a new workstream"),
			DescribeHelpNeeded:     "Need help formatting CTAT email body content.",
			RequestUrgency:         models.CTATRequestUrgencyHigh,
			DateAssistanceNeededBy: now.Add(24 * time.Hour),
			SupportingDocuments:    []*model.CTATRequestDocumentInput{},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		nil,
		email.AddressBook{},
	)
	suite.Require().NoError(err)

	groupOtherBodyContent, err := buildCTATSubmittedBodyContent(suite.testConfigs.Context, emailService, createdGroupOtherRequest)
	suite.Require().NoError(err)

	suite.Equal("Other (Cross-CMMI Strategic Operations)", groupOtherBodyContent.CMMIGroup)
	suite.Empty(groupOtherBodyContent.CMMIDivision)
	suite.Equal("Other (Acquisition strategy support)", groupOtherBodyContent.ContractActivityType)
	suite.Equal("Other (Blanket Purchase Agreement)", groupOtherBodyContent.ContractType)
	suite.Equal(
		"Request for Information (RFI), Other (Assistance drafting evaluation criteria for a new workstream)",
		groupOtherBodyContent.TypeOfHelpNeeded,
	)
	suite.Equal(emailtestconfigs.TestEmailServiceConfig.ClientAddress, groupOtherBodyContent.ClientAddress)

	createdDivisionOtherRequest, err := CTATRequestCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		&model.CTATRequestInput{
			CmmiGroup:              models.CTATCMMIGroupOptionPPG,
			CmmiDivision:           &cmmiDivisionOther,
			CmmiDivisionOther:      new("Division of Innovation Partnerships (PPG/DIP)"),
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
			DescribeHelpNeeded:     "Need help formatting CTAT division email body content.",
			RequestUrgency:         models.CTATRequestUrgencyHigh,
			DateAssistanceNeededBy: now.Add(48 * time.Hour),
			SupportingDocuments:    []*model.CTATRequestDocumentInput{},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		nil,
		email.AddressBook{},
	)
	suite.Require().NoError(err)

	divisionOtherBodyContent, err := buildCTATSubmittedBodyContent(suite.testConfigs.Context, emailService, createdDivisionOtherRequest)
	suite.Require().NoError(err)

	suite.Equal("Other (Division of Innovation Partnerships (PPG/DIP))", divisionOtherBodyContent.CMMIDivision)
}

func TestSendCTATUpdateEmailSkipsWhitespaceOnlyChanges(t *testing.T) {
	mockController := gomock.NewController(t)
	defer mockController.Finish()

	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailService.
		EXPECT().
		Send(gomock.Any(), gomock.Any(), gomock.Any(), gomock.Any(), gomock.Any(), gomock.Any()).
		MaxTimes(0)

	requesterID := uuid.New()
	originalRequest := models.NewCTATRequest(requesterID, requesterID)
	updatedRequest := models.NewCTATRequest(requesterID, requesterID)

	originalRequest.Notes = new("Working through next steps with the team.")
	updatedRequest.Notes = new("  Working through next steps with the team.  ")
	originalRequest.Resolution = new("Resolved and documented.")
	updatedRequest.Resolution = new("\nResolved and documented.\t")

	err := sendCTATUpdateEmail(
		context.Background(),
		mockEmailService,
		email.AddressBook{DefaultSender: "unit-test-execution@mint.cms.gov"},
		originalRequest,
		updatedRequest,
	)
	if err != nil {
		t.Fatalf("expected whitespace-only CTAT update to skip email send, got error: %v", err)
	}
}

func (suite *ResolverSuite) TestSendCTATUpdateEmailSendsOnceForSubstantialChange() {
	mockController := gomock.NewController(suite.T())
	defer mockController.Finish()

	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailService.
		EXPECT().
		GetConfig().
		Return(&oddmail.GoSimpleMailServiceConfig{
			ClientAddress: "http://localhost:3005",
		}).
		AnyTimes()

	now := time.Now().UTC()
	originalRequest := suite.createTestCTATRequest(
		suite.testConfigs.Principal.Account().ID,
		now.Add(24*time.Hour),
		"CTAT update email contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	requesterAccount, err := originalRequest.RequesterUserAccount(suite.testConfigs.Context)
	suite.Require().NoError(err)
	suite.Require().NotNil(requesterAccount)

	updatedRequest := *originalRequest
	notes := "This is a substantial update."
	updatedRequest.Notes = &notes

	mockEmailService.
		EXPECT().
		Send(
			gomock.Eq("unit-test-execution@mint.cms.gov"),
			gomock.Eq([]string{requesterAccount.Email}),
			gomock.Nil(),
			gomock.Any(),
			gomock.Eq("text/html"),
			gomock.Any(),
		).
		Times(1)

	err = sendCTATUpdateEmail(
		suite.testConfigs.Context,
		mockEmailService,
		email.AddressBook{DefaultSender: "unit-test-execution@mint.cms.gov"},
		originalRequest,
		&updatedRequest,
	)
	suite.NoError(err)
}

func (suite *ResolverSuite) TestCTATRequestCreateDeduplicatesRelatedModelLinks() {
	relatedPlan := suite.createModelPlan("CTAT Create Dedup Related Plan")
	now := time.Now().UTC()

	input := &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           new(models.CTATCMMIDivisionOptionBSGDBOM),
		RelatedMINTModels:      []uuid.UUID{relatedPlan.ID, relatedPlan.ID},
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		DescribeHelpNeeded:     "Need help creating a CTAT request with duplicate related models.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.Add(24 * time.Hour),
		SupportingDocuments:    []*model.CTATRequestDocumentInput{},
	}

	created, err := CTATRequestCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	suite.NotNil(created)

	relatedModels, err := CTATRelatedMINTModelsGetByCTATRequestIDLOADER(suite.testConfigs.Context, created.ID)
	suite.NoError(err)
	suite.Len(relatedModels, 1)
	suite.Equal(relatedPlan.ID, relatedModels[0].ID)
}

func (suite *ResolverSuite) createTestCTATRequest(
	requesterID uuid.UUID,
	dateAssistanceNeededBy time.Time,
	contractName string,
	typeOfHelpNeeded []models.CTATHelpNeededType,
	status models.CTATStatus,
) *models.CTATRequest {
	suite.T().Helper()

	requesterAccount, err := storage.UserAccountGetByID(suite.testConfigs.Store, requesterID)
	suite.Require().NoError(err)
	suite.Require().NotNil(requesterAccount)
	suite.Require().NotNil(requesterAccount.Username)

	input := &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           new(models.CTATCMMIDivisionOptionBSGDBOM),
		ContractName:           &contractName,
		TypeOfHelpNeeded:       typeOfHelpNeeded,
		DescribeHelpNeeded:     "Need help validating the test CTAT request.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: dateAssistanceNeededBy,
		SupportingDocuments:    []*model.CTATRequestDocumentInput{},
	}

	createdRequest, err := CTATRequestCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		input,
		suite.getTestPrincipal(suite.testConfigs.Store, *requesterAccount.Username),
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		nil,
		email.AddressBook{},
	)
	suite.Require().NoError(err)

	if status == models.CTATStatusNew {
		return createdRequest
	}

	updatedRequest, err := CTATRequestAdminUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		createdRequest.ID,
		map[string]any{"status": &status},
		suite.getTestPrincipal(suite.testConfigs.Store, "ADMI"),
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.Require().NoError(err)

	return updatedRequest
}
