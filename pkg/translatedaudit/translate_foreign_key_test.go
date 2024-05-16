package translatedaudit

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/constants"
)

func (suite *TAuditSuite) TestTranslateForeignKey() {
	suite.Run("user_account returns a user account", func() {

		tableName := "user_account"
		translatedPrincipal, err := translateForeignKey(suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String(), tableName)
		suite.NoError(err)
		suite.EqualValues(suite.testConfigs.Principal.UserAccount.CommonName, translatedPrincipal)

	})
	suite.Run("unknown table returns an error", func() {

		tableName := "unknown_fake_table"
		translatedPrincipal, err := translateForeignKey(suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String(), tableName)
		suite.Error(err)
		suite.EqualValues(uuid.Nil, translatedPrincipal)

	})

	suite.Run("nil store returns an error", func() {

		tableName := "user_account"
		translatedPrincipal, err := translateForeignKey(nil, suite.testConfigs.Principal.UserAccount.ID.String(), tableName)
		suite.Error(err)
		suite.EqualValues(uuid.Nil, translatedPrincipal)

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