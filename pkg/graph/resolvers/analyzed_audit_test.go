package resolvers

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestAnalyzedAuditLoader() {

	today := time.Now()
	yesterday := today.AddDate(0, 0, -1)
	beforeYesterday := yesterday.AddDate(0, 0, -1)

	mp1 := suite.createModelPlan("Test Plan")
	mp2 := suite.createModelPlan("Second Test Plan")
	mp3 := suite.createModelPlan("Third Test Plan")

	_, err1 := AnalyzeModelPlanForAnalyzedAudit(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, today, mp1.ID)
	suite.NoError(err1)

	_, err2 := AnalyzeModelPlanForAnalyzedAudit(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, today, mp2.ID)
	suite.NoError(err2)

	_, err3 := AnalyzeModelPlanForAnalyzedAudit(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, today, mp3.ID)
	suite.NoError(err3)

	// Mock analyzed audit data for the date before
	suite.createDefaultTestAnalyzedAudit(mp1, yesterday)
	suite.createDefaultTestAnalyzedAudit(mp2, yesterday)
	suite.createDefaultTestAnalyzedAudit(mp3, yesterday)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		audits, err := loaders.AnalyzedAuditGetByModelPlanIDsAndDate(ctx, []uuid.UUID{mp1.ID}, today)
		suite.NoError(err)
		suite.Len(audits, 1)
		suite.EqualValues(mp1.ID, audits[0].ModelPlanID)
		return nil
	})
	g.Go(func() error {
		audits, err := loaders.AnalyzedAuditGetByModelPlanIDsAndDate(ctx, []uuid.UUID{mp2.ID}, today)
		suite.NoError(err)
		suite.Len(audits, 1)
		suite.EqualValues(mp2.ID, audits[0].ModelPlanID)
		return nil
	})
	g.Go(func() error {
		audits, err := loaders.AnalyzedAuditGetByModelPlanIDsAndDate(ctx, []uuid.UUID{mp1.ID, mp2.ID, mp3.ID}, today)
		suite.NoError(err)
		suite.Len(audits, 3)
		return nil
	})
	g.Go(func() error {
		audits, err := loaders.AnalyzedAuditGetByModelPlanIDsAndDate(ctx, []uuid.UUID{mp1.ID, mp2.ID, mp3.ID}, yesterday)
		suite.NoError(err)
		suite.Len(audits, 3)

		return nil
	})
	g.Go(func() error {
		audits, err := loaders.AnalyzedAuditGetByModelPlanIDsAndDate(ctx, []uuid.UUID{mp1.ID, mp2.ID, mp3.ID}, beforeYesterday)
		suite.Error(err)
		suite.Len(audits, 0)
		return nil
	})
	err := g.Wait()
	suite.NoError(err)
}
