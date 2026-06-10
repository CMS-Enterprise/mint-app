package resolvers

import (
	"bytes"
	"context"
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
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/emailtestconfigs"
)

func (suite *ResolverSuite) TestCTATRequestByRequesterIDLoader() {
	requesterA := suite.testConfigs.Principal.Account().ID
	requesterBPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "BTAL")
	requesterB := requesterBPrincipal.Account().ID
	requesterCPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "JANE")
	requesterC := requesterCPrincipal.Account().ID

	firstA := suite.insertCommittedCTATRequestRow(
		requesterA,
		time.Date(2026, 2, 10, 9, 0, 0, 0, time.UTC),
		"Requester A contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	secondA := suite.insertCommittedCTATRequestRow(
		requesterA,
		time.Date(2026, 2, 10, 10, 0, 0, 0, time.UTC),
		"Requester A contract 2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ},
		models.CTATStatusAssigned,
	)
	firstB := suite.insertCommittedCTATRequestRow(
		requesterB,
		time.Date(2026, 2, 10, 11, 0, 0, 0, time.UTC),
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
	requestA := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 10, 9, 0, 0, 0, time.UTC),
		"Requester A contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	requestB := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 10, 10, 0, 0, 0, time.UTC),
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

	first := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 10, 9, 0, 0, 0, time.UTC),
		"Admin contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	second := suite.insertCommittedCTATRequestRow(
		suite.getTestPrincipal(suite.testConfigs.Store, "BTMN").Account().ID,
		time.Date(2026, 2, 10, 11, 0, 0, 0, time.UTC),
		"Admin contract 2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusAssigned,
	)

	resolver := &queryResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	resp, err := resolver.CtatRequestsAdmin(adminCtx)
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Len(resp.CtatRequests, 2)
	suite.Equal(2, resp.Count)

	returnedIDs := lo.Map(resp.CtatRequests, func(item *models.CTATRequest, _ int) uuid.UUID {
		return item.ID
	})
	suite.ElementsMatch([]uuid.UUID{first.ID, second.ID}, returnedIDs)
}

func (suite *ResolverSuite) TestCtatRequest() {
	request := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 10, 9, 0, 0, 0, time.UTC),
		"Detail contract",
		[]models.CTATHelpNeededType{
			models.CTATHelpNeededTypeRequestForInformationRFI,
			models.CTATHelpNeededTypeRequestForQuotationRFQ,
		},
		models.CTATStatusAssigned,
	)

	resolver := &queryResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	resp, err := resolver.CtatRequest(suite.testConfigs.Context, request.ID)
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
	request := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 11, 9, 0, 0, 0, time.UTC),
		"Admin update contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	status := models.CTATStatusAssigned
	assignedAdmin := "ADMI"
	notes := "Assigned to CTAT admin during resolver test."

	resolver := &mutationResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	resp, err := resolver.AdminUpdateCTATRequest(adminCtx, request.ID, map[string]any{
		"status":        &status,
		"assignedAdmin": &assignedAdmin,
		"notes":         &notes,
	})
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Equal(models.CTATStatusAssigned, resp.Status)
	suite.Require().NotNil(resp.AssignedAdmin)
	suite.Equal(adminPrincipal.Account().ID, *resp.AssignedAdmin)

	suite.Require().NotNil(resp.Notes)
	suite.Equal(notes, *resp.Notes)

	rows, err := storage.CTATRequestGetByIDLOADER(suite.testConfigs.Store, []uuid.UUID{request.ID})
	suite.NoError(err)
	suite.Len(rows, 1)
	suite.Equal(models.CTATStatusAssigned, rows[0].Status)
	suite.Require().NotNil(rows[0].AssignedAdmin)
	suite.Equal(adminPrincipal.Account().ID, *rows[0].AssignedAdmin)

	suite.Require().NotNil(rows[0].Notes)
	suite.Equal(notes, *rows[0].Notes)
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestClearsAssignedAdmin() {
	request := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 11, 10, 0, 0, 0, time.UTC),
		"Admin clear contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusAssigned,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	request.AssignedAdmin = &adminPrincipal.Account().ID
	request.ModifiedBy = &suite.testConfigs.Principal.Account().ID
	_, err := storage.CTATRequestAdminUpdate(suite.testConfigs.Store, request)
	suite.Require().NoError(err)

	var noAssignedAdmin *string

	resolver := &mutationResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	resp, err := resolver.AdminUpdateCTATRequest(adminCtx, request.ID, map[string]any{
		"assignedAdmin": noAssignedAdmin,
	})
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Nil(resp.AssignedAdmin)

	rows, err := storage.CTATRequestGetByIDLOADER(suite.testConfigs.Store, []uuid.UUID{request.ID})
	suite.NoError(err)
	suite.Len(rows, 1)
	suite.Nil(rows[0].AssignedAdmin)
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestUpdatesResolution() {
	request := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 11, 11, 0, 0, 0, time.UTC),
		"Admin resolution contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusInProgress,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	resolution := "Resolved during resolver-layer admin update test."

	resolver := &mutationResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	resp, err := resolver.AdminUpdateCTATRequest(adminCtx, request.ID, map[string]any{
		"resolution": &resolution,
	})
	suite.NoError(err)
	suite.NotNil(resp)
	suite.Require().NotNil(resp.Resolution)
	suite.Equal(resolution, *resp.Resolution)

	rows, err := storage.CTATRequestGetByIDLOADER(suite.testConfigs.Store, []uuid.UUID{request.ID})
	suite.NoError(err)
	suite.Len(rows, 1)
	suite.Require().NotNil(rows[0].Resolution)
	suite.Equal(resolution, *rows[0].Resolution)
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestReturnsErrorForUnknownAssignedAdminUsername() {
	request := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 11, 12, 0, 0, 0, time.UTC),
		"Admin unknown user contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	assignedAdmin := "NOT_A_REAL_EUA"

	resolver := &mutationResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	resp, err := resolver.AdminUpdateCTATRequest(adminCtx, request.ID, map[string]any{
		"assignedAdmin": &assignedAdmin,
	})
	suite.Nil(resp)
	suite.ErrorContains(err, "user account not found for username NOT_A_REAL_EUA")
}

func (suite *ResolverSuite) TestAdminUpdateCTATRequestReturnsErrorForWrongNotesType() {
	request := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 11, 13, 0, 0, 0, time.UTC),
		"Admin wrong notes type contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	resolver := &mutationResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	resp, err := resolver.AdminUpdateCTATRequest(adminCtx, request.ID, map[string]any{
		"notes": 123,
	})
	suite.Nil(resp)
	suite.ErrorContains(err, "notes must be a string")
}

func (suite *ResolverSuite) TestCTATRequestRelatedMINTModels() {
	request := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 10, 9, 0, 0, 0, time.UTC),
		"Requester contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	firstPlan := suite.insertCommittedCTATRelatedModelPlanRow(
		time.Date(2026, 2, 10, 8, 0, 0, 0, time.UTC),
		"CTAT Related Model A",
	)
	secondPlan := suite.insertCommittedCTATRelatedModelPlanRow(
		time.Date(2026, 2, 10, 8, 30, 0, 0, time.UTC),
		"CTAT Related Model B",
	)

	suite.insertCommittedCTATRequestModelPlanLinkRow(
		request.ID,
		firstPlan.ID,
		time.Date(2026, 2, 10, 9, 15, 0, 0, time.UTC),
	)
	suite.insertCommittedCTATRequestModelPlanLinkRow(
		request.ID,
		secondPlan.ID,
		time.Date(2026, 2, 10, 9, 30, 0, 0, time.UTC),
	)

	resolver := &cTATRequestResolver{
		&Resolver{
			store: suite.testConfigs.Store,
		},
	}

	relatedModels, err := resolver.RelatedMINTModels(suite.testConfigs.Context, request)
	suite.NoError(err)
	suite.Len(relatedModels, 2)
	suite.Equal([]uuid.UUID{firstPlan.ID, secondPlan.ID}, lo.Map(relatedModels, func(item *models.ModelPlan, _ int) uuid.UUID {
		return item.ID
	}))
}

func (suite *ResolverSuite) TestCTATRequestCreate() {
	relatedPlan := suite.createModelPlan("CTAT Create Related Plan")
	reader := bytes.NewReader([]byte("Some test CTAT file contents"))

	contractName := "CTAT Create Contract"
	input := &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           new(models.CTATCMMIDivisionOptionBSGDBOM),
		RelatedMINTModels:      []uuid.UUID{relatedPlan.ID},
		ContractName:           &contractName,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		DescribeHelpNeeded:     "Need help creating a CTAT request.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: time.Date(2026, 6, 30, 12, 0, 0, 0, time.UTC),
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

	links, err := storage.CTATRequestModelPlanLinkGetByCTATRequestIDLOADER(suite.testConfigs.Store, []uuid.UUID{created.ID})
	suite.NoError(err)
	suite.Len(links, 1)
	suite.Equal(relatedPlan.ID, links[0].ModelPlanID)

	documents, err := storage.CTATRequestDocumentGetByCTATRequestIDLOADER(suite.testConfigs.Store, []uuid.UUID{created.ID})
	suite.NoError(err)
	suite.Len(documents, 1)
	suite.Equal("ctat-request-upload.txt", documents[0].FileName)
	suite.Equal("text/plain", documents[0].FileType)
	suite.False(documents[0].Restricted)
}

func (suite *ResolverSuite) TestBuildCTATSubmittedBodyContentFormatsOtherValues() {
	emailService, err := oddmail.NewGoSimpleMailService(emailtestconfigs.TestEmailServiceConfig)
	suite.Require().NoError(err)

	contractActivityType := models.CTATContractActivityTypeOther
	contractType := models.CTATContractTypeOther

	groupOtherRequest := models.NewCTATRequest(suite.testConfigs.Principal.Account().ID, suite.testConfigs.Principal.Account().ID)
	groupOtherRequest.CmmiGroup = models.CTATCMMIGroupOptionOther
	groupOtherRequest.CmmiGroupOther = new("Cross-CMMI Strategic Operations")
	groupOtherRequest.ContractActivityType = &contractActivityType
	groupOtherRequest.ContractActivityTypeOther = new("Acquisition strategy support")
	groupOtherRequest.ContractType = &contractType
	groupOtherRequest.ContractTypeOther = new("Blanket Purchase Agreement")
	groupOtherRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeRequestForInformationRFI,
		models.CTATHelpNeededTypeOther,
	}
	groupOtherRequest.TypeOfHelpNeededOther = new("Assistance drafting evaluation criteria for a new workstream")
	groupOtherRequest.DescribeHelpNeeded = "Need help formatting CTAT email body content."
	groupOtherRequest.RequestUrgency = models.CTATRequestUrgencyHigh
	groupOtherRequest.DateAssistanceNeededBy = time.Date(2026, 6, 30, 12, 0, 0, 0, time.UTC)

	createdGroupOtherRequest, err := storage.CTATRequestCreate(suite.testConfigs.Store, groupOtherRequest)
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

	divisionOtherRequest := models.NewCTATRequest(suite.testConfigs.Principal.Account().ID, suite.testConfigs.Principal.Account().ID)
	divisionOtherRequest.CmmiGroup = models.CTATCMMIGroupOptionPPG
	divisionOtherRequest.CmmiDivision = new(models.CTATCMMIDivisionOptionOther)
	divisionOtherRequest.CmmiDivisionOther = new("Division of Innovation Partnerships (PPG/DIP)")
	divisionOtherRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{models.CTATHelpNeededTypeRequestForInformationRFI}
	divisionOtherRequest.DescribeHelpNeeded = "Need help formatting CTAT division email body content."
	divisionOtherRequest.RequestUrgency = models.CTATRequestUrgencyHigh
	divisionOtherRequest.DateAssistanceNeededBy = time.Date(2026, 7, 1, 12, 0, 0, 0, time.UTC)

	createdDivisionOtherRequest, err := storage.CTATRequestCreate(suite.testConfigs.Store, divisionOtherRequest)
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

func (suite *ResolverSuite) TestCTATRequestCreateDeduplicatesRelatedModelLinks() {
	relatedPlan := suite.createModelPlan("CTAT Create Dedup Related Plan")

	input := &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           new(models.CTATCMMIDivisionOptionBSGDBOM),
		RelatedMINTModels:      []uuid.UUID{relatedPlan.ID, relatedPlan.ID},
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		DescribeHelpNeeded:     "Need help creating a CTAT request with duplicate related models.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: time.Date(2026, 7, 1, 12, 0, 0, 0, time.UTC),
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

	links, err := storage.CTATRequestModelPlanLinkGetByCTATRequestIDLOADER(suite.testConfigs.Store, []uuid.UUID{created.ID})
	suite.NoError(err)
	suite.Len(links, 1)
	suite.Equal(relatedPlan.ID, links[0].ModelPlanID)
}

func (suite *ResolverSuite) insertCommittedCTATRequestRow(
	requesterID uuid.UUID,
	createdDts time.Time,
	contractName string,
	typeOfHelpNeeded []models.CTATHelpNeededType,
	status models.CTATStatus,
) *models.CTATRequest {
	suite.T().Helper()

	tx, err := suite.testConfigs.Store.Beginx()
	suite.Require().NoError(err)

	_, err = tx.NamedExec(sqlqueries.Utility.SetSessionCurrentUser, utilitysql.CreateUserIDQueryMap(suite.testConfigs.Principal.Account().ID))
	suite.Require().NoError(err)

	helpNeeded := models.EnumArray[models.CTATHelpNeededType](typeOfHelpNeeded)
	dateAssistanceNeededBy := createdDts.Add(24 * time.Hour)
	cmmiDivision := models.CTATCMMIDivisionOptionBSGDBOM
	request := models.NewCTATRequest(suite.testConfigs.Principal.Account().ID, requesterID)
	request.Status = status
	request.CmmiGroup = models.CTATCMMIGroupOptionBSG
	request.CmmiDivision = &cmmiDivision
	request.ContractName = &contractName
	request.TypeOfHelpNeeded = helpNeeded
	request.DescribeHelpNeeded = "Need help validating the test CTAT request."
	request.RequestUrgency = models.CTATRequestUrgencyHigh
	request.DateAssistanceNeededBy = dateAssistanceNeededBy
	request.CreatedDts = createdDts

	createdRequest, err := storage.CTATRequestCreate(tx, request)
	suite.Require().NoError(err)

	err = tx.Commit()
	suite.Require().NoError(err)

	return createdRequest
}

func (suite *ResolverSuite) insertCommittedCTATRelatedModelPlanRow(
	createdDts time.Time,
	modelName string,
) *models.ModelPlan {
	suite.T().Helper()

	tx, err := suite.testConfigs.Store.Beginx()
	suite.Require().NoError(err)

	_, err = tx.NamedExec(sqlqueries.Utility.SetSessionCurrentUser, utilitysql.CreateUserIDQueryMap(suite.testConfigs.Principal.Account().ID))
	suite.Require().NoError(err)

	id := uuid.New()
	_, err = tx.Exec(
		`
			INSERT INTO model_plan (
				id,
				model_name,
				archived,
				status,
				created_by,
				created_dts
			)
			VALUES ($1, $2, $3, $4, $5, $6)
		`,
		id,
		modelName,
		false,
		models.ModelStatusPlanDraft,
		suite.testConfigs.Principal.Account().ID,
		createdDts,
	)
	suite.Require().NoError(err)

	err = tx.Commit()
	suite.Require().NoError(err)

	plan := &models.ModelPlan{
		ModelName: modelName,
		Archived:  false,
		Status:    models.ModelStatusPlanDraft,
	}
	plan.ID = id
	plan.CreatedBy = suite.testConfigs.Principal.Account().ID
	plan.CreatedDts = createdDts

	return plan
}

func (suite *ResolverSuite) insertCommittedCTATRequestModelPlanLinkRow(
	ctatRequestID uuid.UUID,
	modelPlanID uuid.UUID,
	createdDts time.Time,
) *models.CTATRequestModelPlanLink {
	suite.T().Helper()

	tx, err := suite.testConfigs.Store.Beginx()
	suite.Require().NoError(err)

	_, err = tx.NamedExec(sqlqueries.Utility.SetSessionCurrentUser, utilitysql.CreateUserIDQueryMap(suite.testConfigs.Principal.Account().ID))
	suite.Require().NoError(err)

	link := &models.CTATRequestModelPlanLink{}
	link.ModelPlanID = modelPlanID
	link.CTATRequestID = ctatRequestID
	link.CreatedBy = suite.testConfigs.Principal.Account().ID
	link.CreatedDts = createdDts

	createdLink, err := storage.CTATRequestModelPlanLinkCreate(tx, link)
	suite.Require().NoError(err)

	err = tx.Commit()
	suite.Require().NoError(err)

	return createdLink
}
