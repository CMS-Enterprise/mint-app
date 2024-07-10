package resolvers

import (
	"time"
)

// NDAAgreementGetByUserID returns an NDA agreement by userID
func (suite *ResolverSuite) TestNDAAgreementGetByUserID() {
	princ := suite.getTestPrincipal(suite.testConfigs.Store, suite.testConfigs.UserInfo.Username) //write to the user table
	suite.NotNil(princ)
	suite.NotNil(princ.Account())

	nda, err := NDAAgreementGetByUserID(suite.testConfigs.Logger, princ, suite.testConfigs.Store)
	suite.NotNil(nda)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.Nil(nda.AgreedDts)

}

// NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func (suite *ResolverSuite) TestNDAAgreementUpdateOrCreate() {

	princ := suite.getTestPrincipal(suite.testConfigs.Store, suite.testConfigs.UserInfo.Username) //write to the user table

	//1. Create New NDA, don't agree
	nda, err := NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, false, princ, suite.testConfigs.Store)
	suite.NotNil(nda)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.Nil(nda.AgreedDts)

	//2. Update NDA, agree, verify that there is a time stamp for agreedDTS
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, princ, suite.testConfigs.Store)
	suite.NotNil(nda)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.NotNil(nda.AgreedDts)

	agreedDTS := time.Time(*nda.AgreedDts)

	//3. Try to agree to NDA again, verify that agreeDTS wasn't updated
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, princ, suite.testConfigs.Store)
	suite.NotNil(nda)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.Equal(nda.AgreedDts, &agreedDTS)

	//4. Remove agreement, see that agreeDTS wasn't updated again
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, false, princ, suite.testConfigs.Store)
	suite.NotNil(nda)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, false)
	suite.EqualValues(nda.AgreedDts, &agreedDTS)

	//5. Add agreement, see that agreeDTS was updated again
	nda, err = NDAAgreementUpdateOrCreate(suite.testConfigs.Logger, true, princ, suite.testConfigs.Store)
	suite.NotNil(nda)
	suite.NoError(err)
	suite.EqualValues(nda.Agreed, true)
	suite.NotEqualValues(nda.AgreedDts, &agreedDTS)

}
