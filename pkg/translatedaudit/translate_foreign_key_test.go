package translatedaudit

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/constants"
)

func (suite *TAuditSuite) TestTranslateForeignKey() {
	suite.Run("user_account returns a user account", func() {

		tableName := "user_account"
		translatedPrincipal, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String(), tableName)
		suite.NoError(err)
		suite.EqualValues(suite.testConfigs.Principal.UserAccount.CommonName, translatedPrincipal)

	})

	//Changes: (Testing) Create a unit test to fetch operational solution. We want to avoid calling the resolver package here to avoid an import cycle issue.
	suite.Run("operational_solution returns an OperationalSolution", func() {
		plan := suite.createModelPlan("test plan")
		need := suite.createOperationalNeed(plan.ID, "To test operational solution translations")
		solName := "make a unit test"
		sol := suite.createOperationalSolution(need.ID, solName)

		tableName := "operational_solution"

		translatedSolution, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, sol.ID.String(), tableName)
		suite.NoError(err)
		suite.EqualValues(solName, translatedSolution)

	})
	suite.Run("unknown table returns an error", func() {

		tableName := "unknown_fake_table"
		translation, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String(), tableName)
		suite.Error(err)
		suite.Nil(translation)

	})

	suite.Run("nil store returns an error", func() {

		tableName := "user_account"
		translation, err := translateForeignKey(suite.testConfigs.Context, nil, suite.testConfigs.Principal.UserAccount.ID.String(), tableName)
		suite.Error(err)
		suite.Nil(translation)

	})

}

func (suite *TAuditSuite) TestGetUserAccountForeignKeyTranslation() {
	translatedPrincipal, err := getUserAccountForeignKeyTranslation(suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String())
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.CommonName, translatedPrincipal)

}

func (suite *TAuditSuite) TestParseInterfaceToUUID() {

	suite.Run("Unparsable string uuid returns an error", func() {
		val := "unparsable UUID"
		retUUID, err := parseInterfaceToUUID(val)
		suite.Error(err)
		suite.EqualValues(uuid.Nil, retUUID)
	})

	suite.Run("Parsable string is parsed", func() {
		systemAccountUUID := constants.GetSystemAccountUUID()
		val := systemAccountUUID.String()
		retUUID, err := parseInterfaceToUUID(val)
		suite.NoError(err)
		suite.EqualValues(systemAccountUUID, retUUID)
	})
	suite.Run("uuid is parsed", func() {
		systemAccountUUID := constants.GetSystemAccountUUID()
		val := systemAccountUUID
		retUUID, err := parseInterfaceToUUID(val)
		suite.NoError(err)
		suite.EqualValues(systemAccountUUID, retUUID)
	})

	suite.Run("Unparsable anything returns an error", func() {
		val := map[string]interface{}{}
		retUUID, err := parseInterfaceToUUID(val)
		suite.Error(err)
		suite.EqualValues(uuid.Nil, retUUID)
	})

}
