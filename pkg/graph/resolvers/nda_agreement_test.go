package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

//NDAAgreementGetByEUA returns an EUA agreement by eua
func (suite *ResolverSuite) TestNDAAgreementGetByEUA() {
	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}

	//TODO, refactor to use the changes to take principal instead of making it here
	nda, err := NDAAgreementGetByEUA(suite.testConfigs.Logger, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.Nil(nda.AgreedDts)

}

//NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func (suite *ResolverSuite) TestNDAAgreementUpdateOrCreate() {
	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}

	//1. Create New NDA, don't agree
	nda, err := NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, false, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.Nil(nda.AgreedDts)

	//2. Update NDA, agree, verify that there is a time stamp for agreedDTS
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.NotNil(nda.AgreedDts)

	agreedDTS := time.Time(*nda.AgreedDts)

	//3. Try to agree to NDA again, verify that agreeDTS wasn't updated
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.Equal(nda.AgreedDts, &agreedDTS)

	//4. Remove agreement, see that agreeDTS wasn't updated again
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, false, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.EqualValues(nda.AgreedDts, &agreedDTS)

	//5. Add agreement, see that agreeDTS was updated again
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.NotEqualValues(nda.AgreedDts, &agreedDTS)

}
