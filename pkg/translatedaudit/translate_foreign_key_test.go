package translatedaudit

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/constants"
	"github.com/cms-enterprise/mint-app/pkg/models"
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

func (suite *TAuditSuite) TestGetMTOMilestoneForeignKeyReferencen() {
	suite.Run("Milestone with foreign key that doesn't reference a milestone returns nil", func() {
		translatedMilestone, err := getMTOMilestoneForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String())
		suite.NoError(err)
		suite.EqualValues(DataNotAvailableMessage, translatedMilestone)
	})
	suite.Run("Milestone with a foreign key will return milestone name", func() {
		modelPlan := suite.createModelPlan("test plan")
		milestoneName := "test milestone"
		milestone := suite.createMTOMilestone(modelPlan.ID, milestoneName)
		translatedMilestone, err := getMTOMilestoneForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, milestone.ID.String())
		suite.NoError(err)
		if suite.NotNil(translatedMilestone) {
			suite.EqualValues(milestoneName, translatedMilestone)
		}

	})

}
func (suite *TAuditSuite) TestGetMTOSolutionForeignKeyReferencen() {
	suite.Run("Solution with foreign key that doesn't reference a solution returns nil", func() {
		translatedSolution, err := getMTOSolutionForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String())
		suite.NoError(err)
		suite.EqualValues(DataNotAvailableMessage, translatedSolution)
	})
	suite.Run("Solution with a foreign key will return solution name", func() {
		modelPlan := suite.createModelPlan("test plan")
		solutionName := "test solution"
		solution := suite.createMTOSolution(modelPlan.ID, solutionName)
		translatedSolution, err := getMTOSolutionForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID.String())
		suite.NoError(err)
		if suite.NotNil(translatedSolution) {
			suite.EqualValues(solutionName, translatedSolution)
		}

	})

}

func (suite *TAuditSuite) TestGetMTOCategoryForeignKeyReferencen() {
	suite.Run("Category with foreign key that doesn't reference a category returns nil", func() {
		translatedCategory, err := getMTOCategoryForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal.UserAccount.ID.String())
		suite.NoError(err)
		suite.EqualValues(DataNotAvailableMessage, translatedCategory)
	})
	suite.Run("Parent Category with a foreign key will return category name", func() {
		// TODO(mto) should we include uncategorized as the subcategory name?
		modelPlan := suite.createModelPlan("test plan")
		categoryName := "test category"
		category := suite.createMTOCategory(modelPlan.ID, categoryName, nil)
		translatedCategory, err := getMTOCategoryForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, category.ID.String())
		suite.NoError(err)

		suite.EqualValues(formatCategoryTranslation(categoryName, nil), translatedCategory)

	})
	suite.Run("Sub category with an existing parent key will return category name with Parent Information", func() {
		modelPlan := suite.createModelPlan("test plan")
		categoryName := "test category"
		category := suite.createMTOCategory(modelPlan.ID, categoryName, nil)
		subCategoryName := "test subcategory"
		subCategory := suite.createMTOCategory(modelPlan.ID, subCategoryName, &category.ID)
		translatedCategoryName, err := getMTOCategoryForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, subCategory.ID.String())
		suite.NoError(err)

		expectedName := formatCategoryTranslation(subCategoryName, &categoryName)

		suite.EqualValues(expectedName, translatedCategoryName)

	})
	suite.Run("Sub category with a deleted parent key will return category name with Information Not available", func() {

		modelPlan := suite.createModelPlan("test plan")
		categoryName := "test category"
		category := suite.createMTOCategory(modelPlan.ID, categoryName, nil)

		subCategoryName := "test subcategory"
		subCategory := suite.createMTOCategory(modelPlan.ID, subCategoryName, &category.ID)
		suite.deleteMTOCategory(category.ID)
		// this also deletes the subcateogyr
		translatedCategoryName, err := getMTOCategoryForeignKeyReference(suite.testConfigs.Context, suite.testConfigs.Store, subCategory.ID.String())
		suite.NoError(err)

		expectedName := DataNotAvailableMessage

		suite.EqualValues(expectedName, translatedCategoryName)

	})

}
