package resolvers

// AuditChangeCollectionByIDAndTable returns changes based on table name and primary key
func (suite *ResolverSuite) TestAuditChangeCollectionByIDAndTable() {

	modelNames := [4]string{"Plan For Audit0", "Plan For Audit1", "Plan For Audit2", "Plan For Audit3"}

	plan := suite.createModelPlan(modelNames[0])
	auditChanges, err := AuditChangeCollectionByIDAndTable(suite.testConfigs.Logger, "model_plan", plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(auditChanges, 1)

	for i := 1; i < len(modelNames); i++ {
		changes := map[string]interface{}{
			"modelName": modelNames[i],
		}
		_, err = ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
		suite.NoError(err)
	}

	auditChanges, err = AuditChangeCollectionByIDAndTable(suite.testConfigs.Logger, "model_plan", plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(auditChanges, len(modelNames)) // one record for insert, plus the number of updates

	for i := 0; i < len(modelNames); i++ {
		field := auditChanges[i].Fields["model_name"]

		suite.EqualValues(modelNames[i], field.New) //check that the new value is what the change was in the expected order
		if i == 0 {
			suite.EqualValues(nil, field.Old)

		} else {
			suite.EqualValues(modelNames[i-1], field.Old)
		}

	}

}
