package resolvers

import (
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestCTATRequestLiteByRequesterIDLoader() {
	requesterA := suite.testConfigs.Principal.Account().ID
	requesterBPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "CTATRequesterB_"+uuid.NewString())
	requesterB := requesterBPrincipal.Account().ID
	requesterCPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "CTATRequesterC_"+uuid.NewString())
	requesterC := requesterCPrincipal.Account().ID

	firstA := suite.insertCommittedCTATRequestLiteRow(
		requesterA,
		time.Date(2026, 2, 10, 9, 0, 0, 0, time.UTC),
		"Requester A contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRfi},
		models.CTATStatusNew,
	)
	secondA := suite.insertCommittedCTATRequestLiteRow(
		requesterA,
		time.Date(2026, 2, 10, 10, 0, 0, 0, time.UTC),
		"Requester A contract 2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRfq},
		models.CTATStatusAssigned,
	)
	firstB := suite.insertCommittedCTATRequestLiteRow(
		requesterB,
		time.Date(2026, 2, 10, 11, 0, 0, 0, time.UTC),
		"Requester B contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRfp},
		models.CTATStatusClosed,
	)

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, []uuid.UUID]{
		{Key: requesterA, Expected: []uuid.UUID{firstA.ID, secondA.ID}},
		{Key: requesterB, Expected: []uuid.UUID{firstB.ID}},
		{Key: requesterC, Expected: []uuid.UUID{}},
	}

	verifyFunc := func(data []*models.CTATRequestLite, expected []uuid.UUID) bool {
		returnedIDs := lo.Map(data, func(item *models.CTATRequestLite, _ int) uuid.UUID {
			return item.ID
		})
		return suite.ElementsMatch(expected, returnedIDs)
	}

	loaders.VerifyLoaders[uuid.UUID, []*models.CTATRequestLite, []uuid.UUID](
		suite.testConfigs.Context,
		&suite.Suite,
		loaders.CTATRequest.ByRequesterID,
		expectedResults,
		verifyFunc,
	)
}

func (suite *ResolverSuite) insertCommittedCTATRequestLiteRow(
	requesterID uuid.UUID,
	createdDts time.Time,
	contractName string,
	typeOfHelpNeeded []models.CTATHelpNeededType,
	status models.CTATStatus,
) *models.CTATRequestLite {
	suite.T().Helper()

	tx, err := suite.testConfigs.Store.Beginx()
	suite.Require().NoError(err)

	_, err = tx.NamedExec(sqlqueries.Utility.SetSessionCurrentUser, utilitysql.CreateUserIDQueryMap(suite.testConfigs.Principal.Account().ID))
	suite.Require().NoError(err)

	id := uuid.New()
	helpNeeded := models.EnumArray[models.CTATHelpNeededType](typeOfHelpNeeded)
	dateAssistanceNeededBy := createdDts.Add(24 * time.Hour)

	var inserted struct {
		ID                    uuid.UUID `db:"id"`
		HumanReadableIDNumber int       `db:"human_readable_id_number"`
	}

	err = tx.QueryRowx(
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
		suite.testConfigs.Principal.Account().ID,
		createdDts,
	).StructScan(&inserted)
	suite.Require().NoError(err)

	err = tx.Commit()
	suite.Require().NoError(err)

	statusCopy := status

	return &models.CTATRequestLite{
		ID:                    inserted.ID,
		Requester:             requesterID,
		HumanReadableIDNumber: inserted.HumanReadableIDNumber,
		SubmissionDate:        createdDts,
		ContractName:          &contractName,
		TypeOfHelpNeeded:      typeOfHelpNeeded,
		Status:                &statusCopy,
	}
}
