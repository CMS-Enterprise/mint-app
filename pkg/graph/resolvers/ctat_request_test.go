package resolvers

import (
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
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
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRfi},
		models.CTATStatusNew,
	)
	secondA := suite.insertCommittedCTATRequestRow(
		requesterA,
		time.Date(2026, 2, 10, 10, 0, 0, 0, time.UTC),
		"Requester A contract 2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRfq},
		models.CTATStatusAssigned,
	)
	firstB := suite.insertCommittedCTATRequestRow(
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

func (suite *ResolverSuite) TestCtatRequestsAdmin() {
	adminPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	suite.True(adminPrincipal.AllowASSESSMENT())
	adminCtx := appcontext.WithPrincipal(suite.testConfigs.Context, adminPrincipal)

	first := suite.insertCommittedCTATRequestRow(
		suite.testConfigs.Principal.Account().ID,
		time.Date(2026, 2, 10, 9, 0, 0, 0, time.UTC),
		"Admin contract 1",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRfi},
		models.CTATStatusNew,
	)
	second := suite.insertCommittedCTATRequestRow(
		suite.getTestPrincipal(suite.testConfigs.Store, "BTMN").Account().ID,
		time.Date(2026, 2, 10, 11, 0, 0, 0, time.UTC),
		"Admin contract 2",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRfp},
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

	request := &models.CTATRequest{
		Requester:              requesterID,
		Status:                 status,
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           pointerTo(models.CTATCMMIDivisionOptionBSGDBOM),
		ContractName:           &contractName,
		TypeOfHelpNeeded:       helpNeeded,
		DescribeHelpNeeded:     "Need help validating the test CTAT request.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: dateAssistanceNeededBy,
		HumanReadableIDNumber:  inserted.HumanReadableIDNumber,
	}
	request.ID = inserted.ID
	request.CreatedBy = suite.testConfigs.Principal.Account().ID
	request.CreatedDts = createdDts

	return request
}

func pointerTo[T any](value T) *T {
	return &value
}
