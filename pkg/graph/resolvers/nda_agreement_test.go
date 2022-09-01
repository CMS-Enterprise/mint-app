package resolvers

import (
	"time"
)

// NDAAgreementGetByEUA returns an EUA agreement by eua
func (suite *ResolverSuite) TestNDAAgreementGetByEUA() {

	nda, err := NDAAgreementGetByEUA(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.Nil(nda.AgreedDts)

}

// NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func (suite *ResolverSuite) TestNDAAgreementUpdateOrCreate() {

	//1. Create New NDA, don't agree
	nda, err := NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, false, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.Nil(nda.AgreedDts)

	//2. Update NDA, agree, verify that there is a time stamp for agreedDTS
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.NotNil(nda.AgreedDts)

	agreedDTS := time.Time(*nda.AgreedDts)

	//3. Try to agree to NDA again, verify that agreeDTS wasn't updated
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.Equal(nda.AgreedDts, &agreedDTS)

	//4. Remove agreement, see that agreeDTS wasn't updated again
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, false, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.EqualValues(nda.AgreedDts, &agreedDTS)

	//5. Add agreement, see that agreeDTS was updated again
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.NotEqualValues(nda.AgreedDts, &agreedDTS)

}
