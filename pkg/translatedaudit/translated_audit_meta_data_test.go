package translatedaudit

import (
	"fmt"
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *TAuditSuite) TestDiscussionReplyMetaDataGet() {
	plan := suite.createModelPlan("testPlan")
	discussionContent := "Blah blah blah discussion"
	discussion := suite.createPlanDiscussion(plan.ID, discussionContent)
	replyContent := "that's very interesting"

	reply := suite.createDiscussionReply(discussion.ID, replyContent)
	now := time.Now()
	numReplies := 1

	metaData, err := DiscussionReplyMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, reply.ID.String(), discussion.ID.String(), now)
	suite.NoError(err)
	suite.NotNil(metaData)

	suite.EqualValues(discussionContent, metaData.DiscussionContent)
	suite.EqualValues(discussion.ID, metaData.DiscussionID)
	suite.EqualValues(numReplies, metaData.NumberOfReplies)

	tableName := "discussion_reply"
	suite.EqualValues(tableName, metaData.TableName)
	suite.EqualValues(0, metaData.Version)

}

func (suite *TAuditSuite) TestOperationalNeedMetaDataGet() {
	plan := suite.createModelPlan("test plan")
	needName := "To test operational solution meta data"
	need := suite.createOperationalNeed(plan.ID, needName)

	// the test function makes a custom solution
	needIsOther := true
	metaData, err := OperationalNeedMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, need.ID.String())

	suite.NoError(err)
	suite.NotNil(metaData)

	suite.EqualValues(needName, metaData.NeedName)
	suite.EqualValues(needIsOther, metaData.IsOther)

	tableName := "operational_need"
	suite.EqualValues(tableName, metaData.TableName)
	suite.EqualValues(0, metaData.Version)

}

func (suite *TAuditSuite) TestOperationalSolutionMetaDataGet() {
	plan := suite.createModelPlan("test plan")
	needName := "To test operational solution meta data"
	need := suite.createOperationalNeed(plan.ID, needName)
	solName := "make a unit test"
	// we round to the micro second, because when the data is serialized to the db in meta data, it rounds to micro seconds
	mustFinish := time.Now().UTC().Round(time.Microsecond)
	mustStart := mustFinish.Add(-24 * time.Hour)
	solStatus := models.OpSAtRisk
	solOtherHeader := models.StringPointer("hooray! It's the other header!")
	sol := suite.createOperationalSolution(need.ID, solName, func(os *models.OperationalSolution) {
		os.MustStartDts = &mustStart
		os.MustFinishDts = &mustFinish
		os.Status = solStatus
		os.OtherHeader = solOtherHeader
	})
	// the test function makes a custom solution
	needIsOther := true
	solIsOther := true

	metaData, metaDataType, err := OperationalSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, sol.ID.String())

	suite.NoError(err)
	suite.NotNil(metaData)

	if suite.NotNil(metaDataType) {
		suite.EqualValues(models.TAMetaOperationalSolution, *metaDataType)
	}

	suite.EqualValues(needName, metaData.NeedName)
	suite.EqualValues(needIsOther, metaData.NeedIsOther)
	suite.EqualValues(0, metaData.NumberOfSubtasks)

	suite.EqualValues(solName, metaData.SolutionName)
	if suite.NotNil(metaData.SolutionMustFinish) {
		suite.EqualValues(mustFinish, metaData.SolutionMustFinish.UTC())
	}

	if suite.NotNil(metaData.SolutionMustStart) {
		suite.EqualValues(mustStart, metaData.SolutionMustStart.UTC())
	}
	suite.EqualValues(solStatus, metaData.SolutionStatus)
	suite.EqualValues(solIsOther, metaData.SolutionIsOther)
	suite.EqualValues(solOtherHeader, metaData.SolutionOtherHeader)

	tableName := "operational_solution"
	suite.EqualValues(tableName, metaData.TableName)
	suite.EqualValues(0, metaData.Version)

}

func (suite *TAuditSuite) TestOperationalSolutionSubtaskMetaDataGet() {

	plan := suite.createModelPlan("test plan")
	needName := "To test operational solution meta data"
	need := suite.createOperationalNeed(plan.ID, needName)
	solName := "make a unit test"
	mustFinish := time.Now().UTC()
	mustStart := mustFinish.Add(-24 * time.Hour)
	solStatus := models.OpSAtRisk
	solOtherHeader := models.StringPointer("hooray! It's the other header!")
	sol := suite.createOperationalSolution(need.ID, solName, func(os *models.OperationalSolution) {
		os.MustStartDts = &mustStart
		os.MustFinishDts = &mustFinish
		os.Status = solStatus
		os.OtherHeader = solOtherHeader
	})

	subtaskNameNew := "hooray! a subtaskNew"
	subtaskNameNewForChanges := "hooray! a subtaskNewForChanges"
	subtaskNameOldForChanges := "hooray! a subtaskOldForChanges"
	subtaskStatus := models.OperationalSolutionSubtaskStatusDone

	subTask := suite.createOperationalSolutionSubtask(sol.ID, subtaskNameNew, &subtaskStatus)
	operation := models.DBOpInsert
	changes := models.AuditFields{
		"name": models.AuditField{
			New: subtaskNameNewForChanges,
			Old: subtaskNameOldForChanges,
		},
	}
	emptyChanges := models.AuditFields{}
	// the test function makes a custom solution
	needIsOther := true
	solIsOther := true

	metaData, err := OperationalSolutionSubtaskMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, subTask.ID.String(), sol.ID.String(), changes, operation)

	suite.NoError(err)
	suite.NotNil(metaData)

	suite.EqualValues(needName, metaData.NeedName)
	suite.EqualValues(needIsOther, metaData.NeedIsOther)
	suite.EqualValues(1, metaData.NumberOfSubtasks)

	suite.EqualValues(solName, metaData.SolutionName)

	suite.EqualValues(solIsOther, metaData.SolutionIsOther)
	suite.EqualValues(solOtherHeader, metaData.SolutionOtherHeader)

	tableName := "operational_solution_subtask"
	suite.EqualValues(tableName, metaData.TableName)
	suite.EqualValues(0, metaData.Version)

	//Assert it gets the name from the changes object
	suite.EqualValues(subtaskNameNewForChanges, metaData.SubtaskName)

	suite.Run("A delete or truncate without a name in the changes object will error", func() {
		metaData, err := OperationalSolutionSubtaskMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, subTask.ID.String(), sol.ID.String(), emptyChanges, models.DBOpDelete)

		suite.Error(err)
		suite.Nil(metaData)
	})
	suite.Run("An update without a name in the changes object will fetch from DB", func() {

		metaData, err := OperationalSolutionSubtaskMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, subTask.ID.String(), sol.ID.String(), emptyChanges, models.DBOpUpdate)

		suite.NoError(err)
		suite.NotNil(metaData)
		suite.EqualValues(subtaskNameNew, metaData.SubtaskName)
	})

}

func (suite *TAuditSuite) TestDocumentSolutionLinkMetaDataGet() {

	plan := suite.createModelPlan("test plan")
	needName := "To test operational solution meta data"
	need := suite.createOperationalNeed(plan.ID, needName)
	solName := "make a unit test"
	mustFinish := time.Now().UTC()
	mustStart := mustFinish.Add(-24 * time.Hour)
	solStatus := models.OpSAtRisk
	solOtherHeader := models.StringPointer("hooray! It's the other header!")
	sol := suite.createOperationalSolution(need.ID, solName, func(os *models.OperationalSolution) {
		os.MustStartDts = &mustStart
		os.MustFinishDts = &mustFinish
		os.Status = solStatus
		os.OtherHeader = solOtherHeader
	})

	docName := "hooray! a document"

	document := suite.createPlanDocument(plan.ID, docName)

	link := suite.createDocumentSolutionLink(document.ID, sol.ID)

	operation := models.DBOpInsert
	changes := models.AuditFields{
		"document_id": models.AuditField{
			New: document.ID,
			Old: nil,
		},
	}

	// the test function makes a custom solution
	needIsOther := true
	solIsOther := true

	metaData, metaDataType, err := DocumentSolutionLinkMetaDataGet(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		link.ID,
		sol.ID,
		changes,
		operation)

	suite.NoError(err)
	suite.NotNil(metaData)
	if suite.NotNil(metaDataType) {
		suite.EqualValues(models.TAMetaDocumentSolutionLink, *metaDataType)
	}

	suite.EqualValues(needName, metaData.NeedName)
	suite.EqualValues(needIsOther, metaData.NeedIsOther)

	suite.EqualValues(solName, metaData.SolutionName)

	suite.EqualValues(solIsOther, metaData.SolutionIsOther)
	suite.EqualValues(solOtherHeader, metaData.SolutionOtherHeader)

	// Document ID is always present
	suite.EqualValues(document.ID, metaData.DocumentID)

	if suite.NotNil(metaData.DocumentName) {
		suite.EqualValues(document.FileName, *metaData.DocumentName)
	}
	if suite.NotNil(metaData.DocumentType) {
		suite.EqualValues(document.DocumentType, *metaData.DocumentType)
	}
	if suite.NotNil(metaData.DocumentVisibility) {
		suite.EqualValues(fmt.Sprint(document.Restricted), *metaData.DocumentVisibility)
	}

	tableName := "document_solution_link"
	suite.EqualValues(tableName, metaData.TableName)
	suite.EqualValues(0, metaData.Version)

	// Delete the document and run tests on empty state
	suite.deleteDocument(document.ID)

	suite.Run("deleted document returns doc ID, and nil other doc info", func() {

		metaData, metaDataType, err := DocumentSolutionLinkMetaDataGet(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			link.ID,
			sol.ID,
			changes,
			operation)

		suite.NoError(err)
		suite.NotNil(metaData)
		suite.NotNil(metaDataType)
		// Document ID is always present
		suite.EqualValues(document.ID, metaData.DocumentID)

		// this document information should be nil
		suite.Nil(metaData.DocumentName)
		suite.Nil(metaData.DocumentType)
		suite.Nil(metaData.DocumentVisibility)

	})

	suite.Run("deleted document fails if inappropriate change field is present, and nil other doc info", func() {
		//changes doesn't have doc ID for the old value
		metaData, metaDataType, err := DocumentSolutionLinkMetaDataGet(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			link.ID,
			sol.ID,
			changes,
			models.DBOpDelete)

		suite.Error(err)
		suite.Nil(metaData)
		suite.Nil(metaDataType)
	})

	suite.Run("deleted document fails if inappropriate change field is present, and nil other doc info", func() {
		//changes doesn't have doc ID for the old value
		emptyChanges := models.AuditFields{}
		metaData, metaDataType, err := DocumentSolutionLinkMetaDataGet(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			link.ID,
			sol.ID,
			emptyChanges,
			models.DBOpDelete)

		suite.Error(err)
		suite.Nil(metaData)
		suite.Nil(metaDataType)
	})
}

func (suite *TAuditSuite) TestPlanCrTdlMetaDataGet() {

	plan := suite.createModelPlan("testPlan")
	idNumberDB := "test ID number In DB"

	// Make a value distinct from actual value to assert that the data can come from the field or the database
	idNumberNew := "test ID number in New field"
	idNumberOld := "test ID number in Old field"
	cr := suite.createPlanCR(plan.ID, idNumberDB)
	tdl := suite.createPlanTDL(plan.ID, idNumberDB)
	crTable := "plan_cr"
	tdlTable := "plan_tdl"
	insertOperation := models.DBOpInsert

	// mock the changes we'd get from an insert
	changes := models.AuditFields{
		"id_number": models.AuditField{
			New: idNumberNew,
			Old: nil,
		},
	}
	changesForDelete := models.AuditFields{
		"id_number": models.AuditField{
			New: nil,
			Old: idNumberOld,
		},
	}
	emptyChanges := models.AuditFields{}

	// Get CR MetaData
	suite.Run("CR with id_number field present will favor that field", func() {
		crMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, cr.ID, crTable, changes, insertOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(crMetaData) {
			suite.EqualValues("id_number", crMetaData.Relation)
			suite.EqualValues(idNumberNew, crMetaData.RelationContent)
		}
	})
	// Get TDL MetaData
	suite.Run("TDL with id_number field present will favor that field", func() {
		tdlMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, tdl.ID, tdlTable, changes, insertOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(tdlMetaData) {
			suite.EqualValues("id_number", tdlMetaData.Relation)
			suite.EqualValues(idNumberNew, tdlMetaData.RelationContent)
		}
	})

	// Test when changes aren't present in the audit fields
	suite.Run("CR without id_number field present will fetch that field from the DB", func() {
		// give empty changes to simulate no change data
		crMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, cr.ID, crTable, emptyChanges, insertOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(crMetaData) {
			suite.EqualValues("id_number", crMetaData.Relation)
			suite.EqualValues(idNumberDB, crMetaData.RelationContent)
		}
	})
	suite.Run("TDL without id_number field present will fetch that field from the db", func() {
		// give empty changes to simulate no change data
		tdlMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, tdl.ID, tdlTable, emptyChanges, insertOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(tdlMetaData) {
			suite.EqualValues("id_number", tdlMetaData.Relation)
			suite.EqualValues(idNumberDB, tdlMetaData.RelationContent)
		}
	})
	deleteOperation := models.DBOpDelete

	suite.Run("CR without id_number field present will fail if it is a delete  Operation ", func() {
		// give empty changes to simulate no change data
		crMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, cr.ID, crTable, emptyChanges, deleteOperation)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(crMetaData)
	})

	suite.Run("TDL without id_number field present will fail if it is a delete Operation ", func() {
		// give empty changes to simulate no change data
		tdlMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, tdl.ID, tdlTable, emptyChanges, deleteOperation)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(tdlMetaData)
	})

	//test error state, eg a delete and the change not in the field

	suite.deletePlanCR(cr.ID)
	suite.deletePlanTDL(tdl.ID)

	// Get CR MetaData
	suite.Run("CR with id_number field present for delete will favor that field", func() {
		crMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, cr.ID, crTable, changesForDelete, deleteOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(crMetaData) {
			suite.EqualValues("id_number", crMetaData.Relation)
			suite.EqualValues(idNumberOld, crMetaData.RelationContent)
		}
	})
	// Get TDL MetaData
	suite.Run("TDL with id_number field present for delete will favor that field", func() {
		tdlMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, tdl.ID, tdlTable, changesForDelete, deleteOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(tdlMetaData) {
			suite.EqualValues("id_number", tdlMetaData.Relation)
			suite.EqualValues(idNumberOld, tdlMetaData.RelationContent)
		}
	})

	suite.Run("CR without id_number Old value will fail if it is a delete  Operation ", func() {

		crMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, cr.ID, crTable, changes, deleteOperation)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(crMetaData)
	})

	suite.Run("TDL without id_number Old value will fail if it is a delete Operation ", func() {

		tdlMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, tdl.ID, tdlTable, changes, deleteOperation)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(tdlMetaData)
	})
	suite.Run("CR without id_number  will fail if data should be fetch-able, but record is missing ", func() {
		// give empty changes to simulate no change data
		crMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, cr.ID, crTable, emptyChanges, insertOperation)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(crMetaData)
	})

	suite.Run("TDL without id_number Old value will fail if data should be fetch-able, but record is missing", func() {
		// give empty changes to simulate no change data
		tdlMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, tdl.ID, tdlTable, emptyChanges, insertOperation)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(tdlMetaData)
	})

}

func (suite *TAuditSuite) TestPlanCollaboratorMetaDataGet() {
	plan := suite.createModelPlan("Test Plan for collaborator Audit Meta Data")
	collabUserName := "testCollab"
	collabAccount, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, collabUserName)
	suite.NoError(err)
	collab := suite.createPlanCollaborator(plan.ID, collabUserName)
	tableName := "plan_collaborator"

	changes := models.AuditFields{
		"user_id": models.AuditField{
			New: suite.testConfigs.Principal.UserAccount.ID,
			Old: nil,
		},
	}
	emptyChanges := models.AuditFields{}

	suite.Run("Collab meta data priorities data from changes set", func() {
		collabMeta, metaDataType, err := PlanCollaboratorMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, collab.ID, tableName, changes, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(collabMeta) {
			suite.EqualValues("UserName", collabMeta.Relation)
			suite.EqualValues(suite.testConfigs.Principal.UserAccount.CommonName, collabMeta.RelationContent)
		}
	})

	suite.Run("Collab meta data fetches from DB when field isn't present in change set", func() {
		collabMeta, metaDataType, err := PlanCollaboratorMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, collab.ID, tableName, emptyChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(collabMeta) {
			suite.EqualValues("UserName", collabMeta.Relation)
			suite.EqualValues(collabAccount.UserAccount.CommonName, collabMeta.RelationContent)
		}
	})

	suite.Run("Collab meta data fails when field isn't present in change set for DELETE", func() {
		collabMeta, metaDataType, err := PlanCollaboratorMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, collab.ID, tableName, emptyChanges, models.DBOpDelete)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(collabMeta)
	})

}
