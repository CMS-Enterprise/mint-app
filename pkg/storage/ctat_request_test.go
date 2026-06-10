package storage

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (s *StoreTestSuite) TestCTATRequestCreate() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	cmmiDivision := models.CTATCMMIDivisionOptionBSGDBOM
	contractName := "Create request contract"
	request := &models.CTATRequest{
		Requester:              actorUserID,
		Status:                 models.CTATStatusAssigned,
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           &cmmiDivision,
		ContractName:           &contractName,
		TypeOfHelpNeeded:       models.EnumArray[models.CTATHelpNeededType]{models.CTATHelpNeededTypeRequestForInformationRFI},
		DescribeHelpNeeded:     "Need help creating a CTAT request through storage.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: time.Date(2026, 6, 30, 12, 0, 0, 0, time.UTC),
	}
	request.CreatedBy = actorUserID

	created, err := CTATRequestCreate(tx, request)
	s.Require().NoError(err)

	s.NotEqual(uuid.Nil, created.ID)
	s.Equal(actorUserID, created.Requester)
	s.Equal(models.CTATStatusAssigned, created.Status)
	s.Equal(actorUserID, created.CreatedBy)
	s.False(created.CreatedDts.IsZero())
	s.Nil(created.ModifiedBy)
	s.Nil(created.ModifiedDts)
	s.Greater(created.HumanReadableIDNumber, 0)
	s.Require().NotNil(created.ContractName)
	s.Equal(contractName, *created.ContractName)
	s.Equal(
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		[]models.CTATHelpNeededType(created.TypeOfHelpNeeded),
	)
}

func (s *StoreTestSuite) TestCTATRequestModelPlanLinkCreate() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	request := insertCTATRequestTestRow(
		s,
		tx,
		actorUserID,
		actorUserID,
		time.Date(2026, 1, 18, 9, 0, 0, 0, time.UTC),
		"Link create contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusNew,
	)
	modelPlan := models.NewModelPlan(actorUserID, "CTAT create link test model")
	createdModelPlan, err := s.store.ModelPlanCreate(tx, s.logger, modelPlan)
	s.Require().NoError(err)

	link := &models.CTATRequestModelPlanLink{}
	link.CTATRequestID = request.ID
	link.ModelPlanID = createdModelPlan.ID
	link.CreatedBy = actorUserID

	created, err := CTATRequestModelPlanLinkCreate(tx, link)
	s.Require().NoError(err)

	s.NotEqual(uuid.Nil, created.ID)
	s.Equal(request.ID, created.CTATRequestID)
	s.Equal(createdModelPlan.ID, created.ModelPlanID)
	s.Equal(actorUserID, created.CreatedBy)
	s.False(created.CreatedDts.IsZero())
	s.Nil(created.ModifiedBy)
	s.Nil(created.ModifiedDts)
}

func (s *StoreTestSuite) TestCTATRequestDocumentCreate() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	request := insertCTATRequestTestRow(
		s,
		tx,
		actorUserID,
		actorUserID,
		time.Date(2026, 1, 19, 9, 0, 0, 0, time.UTC),
		"Document create contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ},
		models.CTATStatusAssigned,
	)

	url := "https://example.com/files/ctat-create-test.pdf"
	doc := &models.CTATRequestDocument{
		URL:          &url,
		FileType:     "application/pdf",
		Bucket:       "ctat-docs-test",
		FileKey:      "documents/ctat-create-test.pdf",
		VirusScanned: true,
		VirusClean:   true,
		Restricted:   false,
		FileName:     "ctat-create-test.pdf",
		FileSize:     2048,
	}
	doc.CTATRequestID = request.ID
	doc.CreatedBy = actorUserID

	created, err := CTATRequestDocumentCreate(tx, doc)
	s.Require().NoError(err)

	s.NotEqual(uuid.Nil, created.ID)
	s.Equal(request.ID, created.CTATRequestID)
	s.Equal(actorUserID, created.CreatedBy)
	s.False(created.CreatedDts.IsZero())
	s.Nil(created.ModifiedBy)
	s.Nil(created.ModifiedDts)
	s.Require().NotNil(created.URL)
	s.Equal(url, *created.URL)
	s.Equal("application/pdf", created.FileType)
	s.Equal("ctat-docs-test", created.Bucket)
	s.Equal("documents/ctat-create-test.pdf", created.FileKey)
	s.Equal("ctat-create-test.pdf", created.FileName)
	s.Equal(2048, created.FileSize)
	s.True(created.VirusScanned)
	s.True(created.VirusClean)
	s.False(created.Restricted)
}

func (s *StoreTestSuite) TestCTATRequestGetByRequesterIDLOADERFiltersAndMapsFields() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID
	requesterA := actorUserID
	requesterBPrincipal, err := getTestPrincipal(s.store, "BTAL")
	s.Require().NoError(err)
	requesterB := requesterBPrincipal.Account().ID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	createdDts := time.Date(2026, 1, 15, 9, 30, 0, 0, time.UTC)
	contractName := "Requester A contract"
	expectedTypeOfHelpNeeded := []models.CTATHelpNeededType{
		models.CTATHelpNeededTypeRequestForInformationRFI,
		models.CTATHelpNeededTypeRequestForQuotationRFQ,
	}
	expected := insertCTATRequestTestRow(
		s,
		tx,
		requesterA,
		actorUserID,
		createdDts,
		contractName,
		expectedTypeOfHelpNeeded,
		models.CTATStatusAssigned,
	)
	firstDocument := insertCTATRequestDocumentTestRow(
		s,
		tx,
		expected.ID,
		actorUserID,
		createdDts.Add(5*time.Minute),
		"requester-a-contract-1.pdf",
	)
	secondDocument := insertCTATRequestDocumentTestRow(
		s,
		tx,
		expected.ID,
		actorUserID,
		createdDts.Add(10*time.Minute),
		"requester-a-contract-2.pdf",
	)

	otherRequest := insertCTATRequestTestRow(
		s,
		tx,
		requesterB,
		actorUserID,
		createdDts.Add(2*time.Hour),
		"Requester B contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusNew,
	)
	insertCTATRequestDocumentTestRow(
		s,
		tx,
		otherRequest.ID,
		actorUserID,
		createdDts.Add(15*time.Minute),
		"requester-b-contract-1.pdf",
	)

	rows, err := CTATRequestGetByRequesterIDLOADER(tx, []uuid.UUID{requesterA})
	s.Require().NoError(err)
	s.Require().Len(rows, 1)

	row := rows[0]
	s.Equal(expected.ID, row.ID)
	s.Equal(expected.Requester, row.Requester)
	s.Equal(expected.HumanReadableIDNumber, row.HumanReadableIDNumber)
	s.EqualTime(createdDts, row.CreatedDts)
	s.Require().NotNil(row.ContractName)
	s.Equal(contractName, *row.ContractName)
	s.Equal(expectedTypeOfHelpNeeded, []models.CTATHelpNeededType(row.TypeOfHelpNeeded))
	s.Nil(row.TypeOfHelpNeededOther)
	s.Equal(models.CTATStatusAssigned, row.Status)

	_ = firstDocument
	_ = secondDocument
}

func (s *StoreTestSuite) TestCTATRequestGetByIDLOADERReturnsExpectedRow() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	createdDts := time.Date(2026, 1, 15, 9, 30, 0, 0, time.UTC)
	contractName := "Get by ID contract"
	expectedTypeOfHelpNeeded := []models.CTATHelpNeededType{
		models.CTATHelpNeededTypeRequestForInformationRFI,
		models.CTATHelpNeededTypeRequestForQuotationRFQ,
	}
	expected := insertCTATRequestTestRow(
		s,
		tx,
		actorUserID,
		actorUserID,
		createdDts,
		contractName,
		expectedTypeOfHelpNeeded,
		models.CTATStatusAssigned,
	)

	rows, err := CTATRequestGetByIDLOADER(tx, []uuid.UUID{expected.ID})
	s.Require().NoError(err)
	s.Require().Len(rows, 1)

	row := rows[0]
	s.Require().NotNil(row)

	s.Equal(expected.ID, row.ID)
	s.Equal(expected.Requester, row.Requester)
	s.Equal(expected.HumanReadableIDNumber, row.HumanReadableIDNumber)
	s.EqualTime(createdDts, row.CreatedDts)
	s.Require().NotNil(row.ContractName)
	s.Equal(contractName, *row.ContractName)
	s.Equal(expectedTypeOfHelpNeeded, []models.CTATHelpNeededType(row.TypeOfHelpNeeded))
	s.Nil(row.TypeOfHelpNeededOther)
	s.Equal(models.CTATStatusAssigned, row.Status)
}

func (s *StoreTestSuite) TestCTATRequestGetByRequesterIDLOADEROrdersNewestFirst() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID
	requesterID := actorUserID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	first := insertCTATRequestTestRow(
		s,
		tx,
		requesterID,
		actorUserID,
		time.Date(2026, 1, 15, 9, 0, 0, 0, time.UTC),
		"Oldest contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	second := insertCTATRequestTestRow(
		s,
		tx,
		requesterID,
		actorUserID,
		time.Date(2026, 1, 15, 11, 0, 0, 0, time.UTC),
		"Middle contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusAssigned,
	)
	third := insertCTATRequestTestRow(
		s,
		tx,
		requesterID,
		actorUserID,
		time.Date(2026, 1, 15, 13, 0, 0, 0, time.UTC),
		"Newest contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ},
		models.CTATStatusClosed,
	)

	rows, err := CTATRequestGetByRequesterIDLOADER(tx, []uuid.UUID{requesterID})
	s.Require().NoError(err)
	s.Require().Len(rows, 3)

	s.Equal([]uuid.UUID{third.ID, second.ID, first.ID}, []uuid.UUID{rows[0].ID, rows[1].ID, rows[2].ID})
}

func (s *StoreTestSuite) TestCTATRequestCollectionGetForAdminReturnsAllRows() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID
	requesterA := actorUserID
	requesterBPrincipal, err := getTestPrincipal(s.store, "BTMN")
	s.Require().NoError(err)
	requesterB := requesterBPrincipal.Account().ID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	first := insertCTATRequestTestRow(
		s,
		tx,
		requesterA,
		actorUserID,
		time.Date(2026, 1, 16, 8, 0, 0, 0, time.UTC),
		"Admin contract A1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	second := insertCTATRequestTestRow(
		s,
		tx,
		requesterA,
		actorUserID,
		time.Date(2026, 1, 16, 9, 0, 0, 0, time.UTC),
		"Admin contract A2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusAssigned,
	)
	third := insertCTATRequestTestRow(
		s,
		tx,
		requesterB,
		actorUserID,
		time.Date(2026, 1, 16, 10, 0, 0, 0, time.UTC),
		"Admin contract B1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ},
		models.CTATStatusClosed,
	)

	rows, err := CTATRequestCollectionGetForAdmin(tx)
	s.Require().NoError(err)
	s.Require().Len(rows, 3)
	s.ElementsMatch(
		[]uuid.UUID{first.ID, second.ID, third.ID},
		[]uuid.UUID{rows[0].ID, rows[1].ID, rows[2].ID},
	)
}

func insertCTATRequestTestRow(
	s *StoreTestSuite,
	tx *sqlx.Tx,
	requesterID uuid.UUID,
	createdBy uuid.UUID,
	createdDts time.Time,
	contractName string,
	typeOfHelpNeeded []models.CTATHelpNeededType,
	status models.CTATStatus,
) *models.CTATRequest {
	s.T().Helper()

	helpNeeded := models.EnumArray[models.CTATHelpNeededType](typeOfHelpNeeded)
	dateAssistanceNeededBy := createdDts.Add(24 * time.Hour)

	request := models.NewCTATRequest(createdBy, requesterID)
	request.Status = status
	request.CmmiGroup = models.CTATCMMIGroupOptionBSG
	request.CmmiDivision = new(models.CTATCMMIDivisionOptionBSGDBOM)
	request.ContractName = new(contractName)
	request.TypeOfHelpNeeded = helpNeeded
	request.DescribeHelpNeeded = "Need help validating the test CTAT request."
	request.RequestUrgency = models.CTATRequestUrgencyHigh
	request.DateAssistanceNeededBy = dateAssistanceNeededBy
	request.CreatedDts = createdDts

	createdRequest, err := CTATRequestCreate(tx, request)
	s.Require().NoError(err)

	return createdRequest
}

func insertCTATRequestDocumentTestRow(
	s *StoreTestSuite,
	tx *sqlx.Tx,
	ctatRequestID uuid.UUID,
	createdBy uuid.UUID,
	createdDts time.Time,
	fileName string,
) *models.CTATRequestDocument {
	s.T().Helper()

	url := "https://example.com/files/" + fileName

	document := &models.CTATRequestDocument{
		URL:          &url,
		FileType:     "application/pdf",
		Bucket:       "ctat-docs-test",
		FileKey:      "documents/" + fileName,
		VirusScanned: true,
		VirusClean:   true,
		Restricted:   false,
		FileName:     fileName,
		FileSize:     1024,
	}
	document.CTATRequestID = ctatRequestID
	document.CreatedBy = createdBy
	document.CreatedDts = createdDts

	createdDocument, err := CTATRequestDocumentCreate(tx, document)
	s.Require().NoError(err)

	return createdDocument
}
