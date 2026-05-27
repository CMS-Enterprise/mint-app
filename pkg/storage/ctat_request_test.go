package storage

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

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

	_ = insertCTATRequestTestRow(
		s,
		tx,
		requesterB,
		actorUserID,
		createdDts.Add(2*time.Hour),
		"Requester B contract",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRfp},
		models.CTATStatusNew,
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
		CmmiDivision:           loToPtr(models.CTATCMMIDivisionOptionBSGDBOM),
		ContractName:           &contractName,
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

func loToPtr[T any](value T) *T {
	return &value
}
