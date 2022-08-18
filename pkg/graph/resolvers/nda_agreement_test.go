package resolvers

import (
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
	suite.EqualValues(nda.Accepted, false)
	suite.Nil(nda.AcceptedDts)

}

//NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func (suite *ResolverSuite) TestNDAAgreementUpdateOrCreate() {
	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}

	nda, err := NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, false, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Accepted, false)
	suite.Nil(nda.AcceptedDts)

	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(nda.Accepted, true)
	suite.NotNil(nda.AcceptedDts)

}
