package storage

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
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
		ContractName:           zero.StringFrom(contractName),
		TypeOfHelpNeeded:       models.EnumArray[models.CTATHelpNeededType]{models.CTATHelpNeededTypeRequestForInformationRfi},
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
	s.Equal(zero.StringFrom(contractName), created.ContractName)
	s.Equal(
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRfi},
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
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRfp},
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
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRfq},
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
		models.CTATHelpNeededTypeRequestForInformationRfi,
		models.CTATHelpNeededTypeRequestForQuotationRfq,
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
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRfp},
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
	s.Equal(zero.StringFrom(contractName), row.ContractName)
	s.Equal(expectedTypeOfHelpNeeded, []models.CTATHelpNeededType(row.TypeOfHelpNeeded))
	s.Nil(row.TypeOfHelpNeededOther.Ptr())
	s.Equal(models.CTATStatusAssigned, row.Status)

	_ = firstDocument
	_ = secondDocument
}

func (s *StoreTestSuite) TestCTATRequestGetByIDReturnsExpectedRow() {
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	actorUserID := s.principal.Account().ID

	err = setCurrentSessionUserVariable(tx, actorUserID)
	s.Require().NoError(err)

	createdDts := time.Date(2026, 1, 15, 9, 30, 0, 0, time.UTC)
	contractName := "Get by ID contract"
	expectedTypeOfHelpNeeded := []models.CTATHelpNeededType{
		models.CTATHelpNeededTypeRequestForInformationRfi,
		models.CTATHelpNeededTypeRequestForQuotationRfq,
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

	row, err := CTATRequestGetByID(tx, expected.ID)
	s.Require().NoError(err)
	s.Require().NotNil(row)

	s.Equal(expected.ID, row.ID)
	s.Equal(expected.Requester, row.Requester)
	s.Equal(expected.HumanReadableIDNumber, row.HumanReadableIDNumber)
	s.EqualTime(createdDts, row.CreatedDts)
	s.Equal(zero.StringFrom(contractName), row.ContractName)
	s.Equal(expectedTypeOfHelpNeeded, []models.CTATHelpNeededType(row.TypeOfHelpNeeded))
	s.Nil(row.TypeOfHelpNeededOther.Ptr())
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
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRfi},
		models.CTATStatusNew,
	)
	second := insertCTATRequestTestRow(
		s,
		tx,
		requesterID,
		actorUserID,
		time.Date(2026, 1, 15, 11, 0, 0, 0, time.UTC),
		"Middle contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRfp},
		models.CTATStatusAssigned,
	)
	third := insertCTATRequestTestRow(
		s,
		tx,
		requesterID,
		actorUserID,
		time.Date(2026, 1, 15, 13, 0, 0, 0, time.UTC),
		"Newest contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRfq},
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
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRfi},
		models.CTATStatusNew,
	)
	second := insertCTATRequestTestRow(
		s,
		tx,
		requesterA,
		actorUserID,
		time.Date(2026, 1, 16, 9, 0, 0, 0, time.UTC),
		"Admin contract A2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRfp},
		models.CTATStatusAssigned,
	)
	third := insertCTATRequestTestRow(
		s,
		tx,
		requesterB,
		actorUserID,
		time.Date(2026, 1, 16, 10, 0, 0, 0, time.UTC),
		"Admin contract B1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRfq},
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

	id := uuid.New()
	helpNeeded := models.EnumArray[models.CTATHelpNeededType](typeOfHelpNeeded)
	dateAssistanceNeededBy := createdDts.Add(24 * time.Hour)

	var inserted struct {
		ID                    uuid.UUID `db:"id"`
		HumanReadableIDNumber int       `db:"human_readable_id_number"`
	}

	err := tx.QueryRowx(
		`
			INSERT INTO ctat_request (
				id,
				requester,
				status,
				cmmi_group,
				cmmi_division,
				contract_name,
				type_of_help_needed,
				describe_help_needed,
				request_urgency,
				date_assistance_needed_by,
				created_by,
				created_dts
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
			RETURNING id, human_readable_id_number
		`,
		id,
		requesterID,
		status,
		models.CTATCMMIGroupOptionBSG,
		models.CTATCMMIDivisionOptionBSGDBOM,
		contractName,
		helpNeeded,
		"Need help validating the test CTAT request.",
		models.CTATRequestUrgencyHigh,
		dateAssistanceNeededBy,
		createdBy,
		createdDts,
	).StructScan(&inserted)
	s.Require().NoError(err)

	request := &models.CTATRequest{
		Requester:              requesterID,
		Status:                 status,
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           new(models.CTATCMMIDivisionOptionBSGDBOM),
		ContractName:           zero.StringFrom(contractName),
		TypeOfHelpNeeded:       helpNeeded,
		DescribeHelpNeeded:     "Need help validating the test CTAT request.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: dateAssistanceNeededBy,
		HumanReadableIDNumber:  inserted.HumanReadableIDNumber,
	}
	request.ID = inserted.ID
	request.CreatedBy = createdBy
	request.CreatedDts = createdDts

	return request
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

	id := uuid.New()
	url := "https://example.com/files/" + fileName

	_, err := tx.Exec(
		`
			INSERT INTO ctat_request_document (
				id,
				ctat_request_id,
				url,
				file_type,
				bucket,
				file_key,
				virus_scanned,
				virus_clean,
				restricted,
				file_name,
				file_size,
				created_by,
				created_dts
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		`,
		id,
		ctatRequestID,
		url,
		"application/pdf",
		"ctat-docs-test",
		"documents/"+fileName,
		true,
		true,
		false,
		fileName,
		1024,
		createdBy,
		createdDts,
	)
	s.Require().NoError(err)

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
	document.ID = id
	document.CTATRequestID = ctatRequestID
	document.CreatedBy = createdBy
	document.CreatedDts = createdDts

	return document
}
