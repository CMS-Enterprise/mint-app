package translatedaudit

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *TAuditSuite) TestTranslateForeignKey() {
	suite.Run("user_account returns a user account", func() {

		translatedPrincipal, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String(), models.TNUserAccount)
		suite.NoError(err)
		suite.EqualValues(suite.testConfigs.Principal.UserAccount.CommonName, translatedPrincipal)

	})

	suite.Run("operational_solution returns an OperationalSolution", func() {
		plan := suite.createModelPlan("test plan")
		need := suite.createOperationalNeed(plan.ID, "To test operational solution translations")
		solName := "make a unit test"
		sol := suite.createOperationalSolution(need.ID, solName)

		translatedSolution, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, sol.ID.String(), models.TNOperationalSolution)
		suite.NoError(err)
		suite.EqualValues(solName, translatedSolution)

	})

	suite.Run("existing model returns an existing model", func() {
		existingID := 100001
		existingName := "Advance Payment ACO Model"

		translatedExisting, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, fmt.Sprint(existingID), models.TNExistingModel)
		suite.NoError(err)
		suite.EqualValues(existingName, translatedExisting)

	})

	suite.Run("model_plan returns an ModelPlan", func() {
		planName := "test plan"
		plan := suite.createModelPlan(planName)

		translatedPlan, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, plan.ID.String(), models.TNModelPlan)
		suite.NoError(err)
		suite.EqualValues(planName, translatedPlan)

	})
	suite.Run("plan_document returns an Plan Document", func() {
		planName := "test plan"
		plan := suite.createModelPlan(planName)
		docName := "testing Doc link"
		doc := suite.createPlanDocument(plan.ID, docName)

		translatedDoc, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, doc.ID.String(), models.TNPlanDocument)
		suite.NoError(err)
		stringTranslation, ok := translatedDoc.(*string)
		suite.True(ok)
		if suite.NotNil(translatedDoc) {
			suite.EqualValues(docName, *stringTranslation)
		}

	})
	suite.Run("unknown table returns an error", func() {

		tableName := models.TableName("unknown_fake_table")
		translation, err := translateForeignKey(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String(), tableName)
		suite.Error(err)
		suite.Nil(translation)

	})

	suite.Run("nil store returns an error", func() {

		translation, err := translateForeignKey(suite.testConfigs.Context, nil, suite.testConfigs.Principal.UserAccount.ID.String(), models.TNUserAccount)
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
