package resolvers

import (
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPossibleOperationalSolutionCollectionGetAll() {

	posSols, err := PossibleOperationalSolutionCollectionGetAll(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(posSols)
	possibleCount := len(posSols)

	suite.Greater(possibleCount, 1) // the number of possible needs is determined in the DB. Assert that there is at least more than 1.

}

func (suite *ResolverSuite) TestPossibleOperationalSolutionCollectionGetByKey() {

	testKeys := []models.OperationalSolutionKey{models.OpSKInnovation,
		models.OpSKAcoOs,
		models.OpSKApps,
		models.OpSKCdx,
		models.OpSKCcw,
		models.OpSKCmsBox,
		models.OpSKCmsQualtrics,
		models.OpSKCbosc,
		models.OpSKContractor,
		models.OpSKCpiVetting,
		models.OpSKCrossModelContract,
		models.OpSKEft,
		models.OpSKExistingCmsDataAndProcess,
		models.OpSKEdfr,
		models.OpSKGovdelivery,
		models.OpSKGs,
		models.OpSKHdr,
		models.OpSKHpms,
		models.OpSKHiglas,
		models.OpSKIpc,
		models.OpSKIdr,
		models.OpSKInternalStaff,
		models.OpSKLdg,
		models.OpSKLv,
		models.OpSKMdmPor,
		models.OpSKMdmNcbp,
		models.OpSKMarx,
		models.OpSKOtherNewProcess,
		models.OpSKOutlookMailbox,
		models.OpSKQv,
		models.OpSKRmada,
		models.OpSKArs,
		models.OpSKConnect,
		models.OpSKLoi,
		models.OpSKPostPortal,
		models.OpSKRfa,
		models.OpSKSharedSystems,
		models.OpSKBCDA,
		models.OpSKISP,
		models.OpSKMIDS,
	}

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)

	for _, key := range testKeys {
		g.Go(func() error {
			opSol, err := PossibleOperationalSolutionGetByKey(ctx, key)
			suite.NoError(err)
			if suite.NotNil(opSol) {
				suite.EqualValues(key, opSol.Key)
			}
			return nil
		})
	}
	err := g.Wait()
	suite.NoError(err)
}
