package translatedaudit

import (
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *TAuditSuite) TestDiscussionReplyMetaDataGet() {
	plan := suite.createModelPlan("testPlan")
	discussionContent := "Blah blah blah discussion"
	discussion := suite.createPlanDiscussion(plan.ID, discussionContent)
	replyContent := "that's very interesting"

	_ = suite.createDiscussionReply(discussion.ID, replyContent)
	now := time.Now()
	numReplies := 1

	metaData, err := DiscussionReplyMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, discussion.ID, now)
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
	metaData, err := OperationalNeedMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, need.ID)

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
	// just provide the translated value here instead of trying to translate it for this test
	solStatusTranslated := "At risk"
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

	metaData, metaDataType, err := OperationalSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, sol.ID)

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
	suite.EqualValues(solStatusTranslated, metaData.SolutionStatus)
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

	metaData, err := OperationalSolutionSubtaskMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, subTask.ID, sol.ID, changes, operation)

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
	if suite.NotNil(metaData.SubtaskName) {
		suite.EqualValues(subtaskNameNewForChanges, *metaData.SubtaskName)
	}

	suite.Run("A delete or truncate without a name in the changes object will error", func() {
		metaData, err := OperationalSolutionSubtaskMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, subTask.ID, sol.ID, emptyChanges, models.DBOpDelete)

		suite.Error(err)
		suite.Nil(metaData)
	})
	suite.Run("An update without a name in the changes object will fetch from DB", func() {

		metaData, err := OperationalSolutionSubtaskMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, subTask.ID, sol.ID, emptyChanges, models.DBOpUpdate)

		suite.NoError(err)
		suite.NotNil(metaData)
		if suite.NotNil(metaData.SubtaskName) {
			suite.EqualValues(subtaskNameNew, *metaData.SubtaskName)
		}
	})
	suite.Run("An update without a name in the changes object will fetch from DB, but will not error if the value is nil", func() {

		_, err := suite.testConfigs.Store.OperationalSolutionSubtaskDelete(suite.testConfigs.Logger, subTask.ID, suite.testConfigs.Principal.UserAccount.ID)
		suite.NoError(err)

		metaData, err := OperationalSolutionSubtaskMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, subTask.ID, sol.ID, emptyChanges, models.DBOpUpdate)

		suite.NoError(err)
		suite.NotNil(metaData)
		suite.Nil(metaData.SubtaskName)
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
	// for simplicity, just write the translation here instead of trying to translate it
	visibilityTranslated := "All"
	documentTypeTranslated := "Other"

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
		suite.EqualValues(documentTypeTranslated, *metaData.DocumentType)
	}
	if suite.NotNil(metaData.DocumentVisibility) {
		suite.EqualValues(visibilityTranslated, *metaData.DocumentVisibility)
	}

	suite.EqualValues(models.TNPlanDocumentSolutionLink, metaData.TableName)
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
	crTable := models.TNPlanCr
	tdlTable := models.TNPlanTdl
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
			if suite.NotNil(crMetaData.RelationContent) {
				suite.EqualValues(idNumberNew, *crMetaData.RelationContent)
			}
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
			if suite.NotNil(tdlMetaData.RelationContent) {
				suite.EqualValues(idNumberNew, *tdlMetaData.RelationContent)
			}
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
			if suite.NotNil(crMetaData.RelationContent) {
				suite.EqualValues(idNumberDB, *crMetaData.RelationContent)
			}
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
			if suite.NotNil(tdlMetaData.RelationContent) {
				suite.EqualValues(idNumberDB, *tdlMetaData.RelationContent)
			}
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
			if suite.NotNil(crMetaData.RelationContent) {
				suite.EqualValues(idNumberOld, *crMetaData.RelationContent)
			}
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
			if suite.NotNil(tdlMetaData.RelationContent) {
				suite.EqualValues(idNumberOld, *tdlMetaData.RelationContent)
			}
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
	suite.Run("CR without id_number  will not fail not if data should be fetch-able, but record is missing ", func() {
		// give empty changes to simulate no change data
		crMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, cr.ID, crTable, emptyChanges, insertOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		suite.NotNil(crMetaData)
		suite.Nil(crMetaData.RelationContent)
	})

	suite.Run("TDL without id_number Old value will not fail if data should be fetch-able, but record is missing", func() {
		// give empty changes to simulate no change data
		tdlMetaData, metaDataType, err := PlanCrTdlMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, tdl.ID, tdlTable, emptyChanges, insertOperation)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		suite.NotNil(tdlMetaData)
		suite.Nil(tdlMetaData.RelationContent)
	})

}

func (suite *TAuditSuite) TestPlanCollaboratorMetaDataGet() {
	plan := suite.createModelPlan("Test Plan for collaborator Audit Meta Data")
	collabUserName := "testCollab"
	collabAccount, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, collabUserName)
	suite.NoError(err)
	collab := suite.createPlanCollaborator(plan.ID, collabUserName)

	newChanges := models.AuditFields{
		"user_id": models.AuditField{
			New: suite.testConfigs.Principal.UserAccount.ID,
			Old: nil,
		},
	}

	oldChanges := models.AuditFields{
		"user_id": models.AuditField{
			New: nil,
			Old: suite.testConfigs.Principal.UserAccount.ID,
		},
	}
	emptyChanges := models.AuditFields{}

	suite.Run("Collab meta data priorities data from changes set", func() {
		collabMeta, metaDataType, err := PlanCollaboratorMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, collab.ID, newChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(collabMeta) {
			suite.EqualValues("UserName", collabMeta.Relation)
			if suite.NotNil(collabMeta.RelationContent) {
				suite.EqualValues(suite.testConfigs.Principal.UserAccount.CommonName, *collabMeta.RelationContent)
			}
		}
	})

	suite.Run("Collab meta data fetches from DB when field isn't present in change set", func() {
		collabMeta, metaDataType, err := PlanCollaboratorMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, collab.ID, emptyChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(collabMeta) {
			suite.EqualValues("UserName", collabMeta.Relation)
			if suite.NotNil(collabMeta.RelationContent) {
				suite.EqualValues(collabAccount.UserAccount.CommonName, *collabMeta.RelationContent)
			}

		}
	})

	suite.Run("Collab meta data fails when field isn't present in change set for DELETE", func() {
		collabMeta, metaDataType, err := PlanCollaboratorMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, collab.ID, emptyChanges, models.DBOpDelete)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(collabMeta)
	})
	suite.Run("Collab meta data fails when field isn't present on the correct / NEW / OLD value", func() {
		collabMeta, metaDataType, err := PlanCollaboratorMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, collab.ID, oldChanges, models.DBOpInsert)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(collabMeta)
	})

}

func (suite *TAuditSuite) TestPlanDocumentMetaDataGet() {
	plan := suite.createModelPlan("test model plan for document meta data")
	docNameDB := "docName in database"

	document := suite.createPlanDocument(plan.ID, docNameDB)

	docNameNew := "newDocName"
	docNameOld := "oldDocName"

	newChanges := models.AuditFields{
		"file_name": models.AuditField{
			New: docNameNew,
			Old: nil,
		},
	}

	oldChanges := models.AuditFields{
		"file_name": models.AuditField{
			New: nil,
			Old: docNameOld,
		},
	}
	emptyChanges := models.AuditFields{}

	suite.Run("Document meta data priorities data from changes set (new field on insert)", func() {
		collabMeta, metaDataType, err := PlanDocumentMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, document.ID, newChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(collabMeta) {
			suite.EqualValues("fileName", collabMeta.Relation)
			if suite.NotNil(collabMeta.RelationContent) {
				suite.EqualValues(docNameNew, *collabMeta.RelationContent)
			}
		}
	})
	suite.Run("Document meta data priorities data from changes set (old field on delete)", func() {
		collabMeta, metaDataType, err := PlanDocumentMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, document.ID, oldChanges, models.DBOpDelete)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(collabMeta) {
			suite.EqualValues("fileName", collabMeta.Relation)
			if suite.NotNil(collabMeta.RelationContent) {
				suite.EqualValues(docNameOld, *collabMeta.RelationContent)
			}
		}
	})
	suite.Run("Document meta data gets data from db if not in change set", func() {
		docMeta, metaDataType, err := PlanDocumentMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, document.ID, emptyChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(docMeta) {
			suite.EqualValues("fileName", docMeta.Relation)
			if suite.NotNil(docMeta.RelationContent) {
				suite.EqualValues(docNameDB, *docMeta.RelationContent)
			}
		}
	})

	suite.Run("Document meta data doesn't fail when field isn't present in change set for DELETE, fetch filename from db", func() {
		docMeta, metaDataType, err := PlanDocumentMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, document.ID, emptyChanges, models.DBOpDelete)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(docMeta) {
			suite.EqualValues(docNameDB, *docMeta.RelationContent)
		}
	})
	suite.Run("Document meta data fails when field isn't present on the correct / NEW / OLD value", func() {
		collabMeta, metaDataType, err := PlanDocumentMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, document.ID, oldChanges, models.DBOpInsert)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(collabMeta)
	})

	suite.Run("Document meta data doesn't fail when field isn't present in change set for DELETE, but filename is nil", func() {
		// Delete the document and run tests on empty state
		suite.deleteDocument(document.ID)

		docMeta, metaDataType, err := PlanDocumentMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, document.ID, emptyChanges, models.DBOpDelete)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(docMeta) {
			suite.Nil(docMeta.RelationContent)
		}
	})

}

func (suite *TAuditSuite) TestMTOMilestoneMetaDataGet() {
	plan := suite.createModelPlan("test model plan for milestone meta data")
	milestoneNameDB := "milestoneName in database"

	milestone := suite.createMTOMilestone(plan.ID, milestoneNameDB)

	milestoneNameNew := "newMilestoneName"
	milestoneNameOld := "oldMilestoneName"

	newChanges := models.AuditFields{
		"name": models.AuditField{
			New: milestoneNameNew,
			Old: nil,
		},
	}

	oldChanges := models.AuditFields{
		"name": models.AuditField{
			New: nil,
			Old: milestoneNameOld,
		},
	}
	emptyChanges := models.AuditFields{}

	suite.Run("Milestone meta data priorities data from changes set (new field on insert)", func() {
		milestoneMeta, metaDataType, err := MTOMilestoneMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, milestone.ID, newChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(milestoneMeta) {
			suite.EqualValues("name", milestoneMeta.Relation)
			if suite.NotNil(milestoneMeta.RelationContent) {
				suite.EqualValues(milestoneNameNew, *milestoneMeta.RelationContent)
			}
		}
	})
	suite.Run("Milestone meta data priorities data from changes set (old field on delete)", func() {
		milestoneMeta, metaDataType, err := MTOMilestoneMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, milestone.ID, oldChanges, models.DBOpDelete)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(milestoneMeta) {
			suite.EqualValues("name", milestoneMeta.Relation)
			if suite.NotNil(milestoneMeta.RelationContent) {
				suite.EqualValues(milestoneNameOld, *milestoneMeta.RelationContent)
			}
		}
	})
	suite.Run("Milestone meta data gets data from db if not in change set", func() {
		milestoneMeta, metaDataType, err := MTOMilestoneMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, milestone.ID, emptyChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}
		if suite.NotNil(milestoneMeta) {
			suite.EqualValues("name", milestoneMeta.Relation)
			if suite.NotNil(milestoneMeta.RelationContent) {
				suite.EqualValues(milestoneNameDB, *milestoneMeta.RelationContent)
			}
		}
	})
	suite.Run("A delete or truncate without a name in the changes object will error", func() {
		milestoneMeta, metaDataType, err := MTOMilestoneMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, milestone.ID, emptyChanges, models.DBOpDelete)
		suite.Error(err)
		suite.Nil(milestoneMeta)
		suite.Nil(metaDataType)

	})
	suite.Run("Milestone meta data doesn't fail when field isn't present in change set for DELETE, fetch filename from db", func() {
		milestoneMeta, metaDataType, err := MTOMilestoneMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, milestone.ID, emptyChanges, models.DBOpUpdate)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(milestoneMeta) {
			suite.EqualValues(milestoneNameDB, *milestoneMeta.RelationContent)
		}
	})
	suite.Run("Milestone meta data doesn't fail when field isn't present in change set for DELETE, fetch filename from db", func() {

		err := sqlutils.WithTransactionNoReturn(suite.testConfigs.Store, func(tx *sqlx.Tx) error {
			return storage.MTOMilestoneDelete(tx, suite.testConfigs.Principal.UserAccount.ID, suite.testConfigs.Logger, milestone.ID)
		})
		suite.NoError(err)

		milestoneMeta, metaDataType, err := MTOMilestoneMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, milestone.ID, emptyChanges, models.DBOpUpdate)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(milestoneMeta) {
			suite.Nil(milestoneMeta.RelationContent)
		}
	})
}

func (suite *TAuditSuite) TestMTOSolutionMetaDataGet() {
	plan := suite.createModelPlan("test model plan for solution meta data")
	solutionNameDB := "solutionName in database"

	solution := suite.createMTOSolution(plan.ID, solutionNameDB)

	solutionNameNew := "newSolutionName"
	solutionNameOld := "oldSolutionName"

	newChanges := models.AuditFields{
		"name": models.AuditField{
			New: solutionNameNew,
			Old: nil,
		},
	}

	oldChanges := models.AuditFields{
		"name": models.AuditField{
			New: nil,
			Old: solutionNameOld,
		},
	}
	emptyChanges := models.AuditFields{}

	suite.Run("Solution meta data priorities data from changes set (new field on insert)", func() {
		solutionMeta, metaDataType, err := MTOSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID, newChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(solutionMeta) {
			suite.EqualValues("name", solutionMeta.Relation)
			if suite.NotNil(solutionMeta.RelationContent) {
				suite.EqualValues(solutionNameNew, *solutionMeta.RelationContent)
			}
		}
	})
	suite.Run("Solution meta data priorities data from changes set (old field on delete)", func() {
		solutionMeta, metaDataType, err := MTOSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID, oldChanges, models.DBOpDelete)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}

		if suite.NotNil(solutionMeta) {
			suite.EqualValues("name", solutionMeta.Relation)
			if suite.NotNil(solutionMeta.RelationContent) {
				suite.EqualValues(solutionNameOld, *solutionMeta.RelationContent)
			}
		}
	})
	suite.Run("Solution meta data gets data from db if not in change set", func() {
		solutionMeta, metaDataType, err := MTOSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID, emptyChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaGeneric, *metaDataType)
		}
		if suite.NotNil(solutionMeta) {
			suite.EqualValues("name", solutionMeta.Relation)
			if suite.NotNil(solutionMeta.RelationContent) {
				suite.EqualValues(solutionNameDB, *solutionMeta.RelationContent)
			}
		}
	})
	suite.Run("A delete or truncate without a name in the changes object will error", func() {
		solutionMeta, metaDataType, err := MTOSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID, emptyChanges, models.DBOpDelete)
		suite.Error(err)
		suite.Nil(solutionMeta)
		suite.Nil(metaDataType)

	})
	suite.Run("Solution meta data doesn't fail when field isn't present in change set for DELETE, fetch filename from db", func() {
		solutionMeta, metaDataType, err := MTOSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID, emptyChanges, models.DBOpUpdate)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(solutionMeta) {
			suite.EqualValues(solutionNameDB, *solutionMeta.RelationContent)
		}
	})
	suite.Run("Solution meta data fails when field isn't present in change set for DELETE, fetch filename from db", func() {
		solutionMeta, metaDataType, err := MTOSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID, emptyChanges, models.DBOpDelete)
		suite.Error(err)
		suite.Nil(metaDataType)

		suite.Nil(solutionMeta)
	})
	suite.Run("Solution meta data doesn't fail when field isn't present in change set for UPDATE, fetch filename from db", func() {

		err := sqlutils.WithTransactionNoReturn(suite.testConfigs.Store, func(tx *sqlx.Tx) error {
			return storage.MTOSolutionDelete(tx, suite.testConfigs.Principal.UserAccount.ID, suite.testConfigs.Logger, solution.ID)
		})
		suite.NoError(err)

		solutionMeta, metaDataType, err := MTOSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, solution.ID, emptyChanges, models.DBOpUpdate)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(solutionMeta) {
			suite.Nil(solutionMeta.RelationContent)
		}
	})
}

func (suite *TAuditSuite) TestMTOCategoryMetaDataGet() {
	plan := suite.createModelPlan("test model plan for category meta data")
	categoryNameDB := "categoryName in database"
	// this is the parent actually in the db
	parentCategoryNameDBOld := "old parent categoryName in database"
	parentCategoryNameDBNew := "new parent categoryName in database"

	parentCategoryOld := suite.createMTOCategory(plan.ID, parentCategoryNameDBOld, nil)
	category := suite.createMTOCategory(plan.ID, categoryNameDB, &parentCategoryOld.ID)
	parentCategoryNew := suite.createMTOCategory(plan.ID, parentCategoryNameDBNew, nil)

	categoryParentIDNew := parentCategoryNew.ID
	// this is the id acutally in the db
	categoryParentIDOld := parentCategoryOld.ID

	newChanges := models.AuditFields{
		"parent_id": models.AuditField{
			New: categoryParentIDNew,
			Old: nil,
		},
	}

	oldChanges := models.AuditFields{
		"parent_id": models.AuditField{
			New: nil,
			Old: categoryParentIDOld,
		},
	}
	emptyChanges := models.AuditFields{}

	suite.Run("Category meta data priorities data from changes set (new field on insert)", func() {
		categoryMeta, metaDataType, err := MTOCategoryMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, category.ID, newChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaMTOCategory, *metaDataType)
		}

		if suite.NotNil(categoryMeta) {
			if suite.NotNil(categoryMeta.ParentCategoryID) {
				suite.EqualValues(categoryParentIDNew, *categoryMeta.ParentCategoryID)
			}
		}
	})
	suite.Run("Category meta data priorities data from changes set (old field on delete)", func() {
		categoryMeta, metaDataType, err := MTOCategoryMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, category.ID, oldChanges, models.DBOpDelete)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaMTOCategory, *metaDataType)
		}

		if suite.NotNil(categoryMeta) {
			if suite.NotNil(categoryMeta.ParentCategoryID) {
				suite.EqualValues(categoryParentIDOld, *categoryMeta.ParentCategoryID)
			}
		}
	})
	suite.Run("Category meta data gets data from db if not in change set", func() {
		categoryMeta, metaDataType, err := MTOCategoryMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, category.ID, emptyChanges, models.DBOpInsert)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaMTOCategory, *metaDataType)
		}
		if suite.NotNil(categoryMeta) {
			if suite.NotNil(categoryMeta.ParentCategoryID) {
				suite.EqualValues(parentCategoryOld.ID, *categoryMeta.ParentCategoryID)
				if suite.NotNil(categoryMeta.ParentCategoryName) {
					suite.EqualValues(parentCategoryNameDBOld, *categoryMeta.ParentCategoryName)
				}

			}
		}
	})
	suite.Run("A delete or truncate without a parentID in the changes object will not error, (parent_id will not show up in changes if not set, but will fetch from the db)", func() {
		categoryMeta, metaDataType, err := MTOCategoryMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, category.ID, emptyChanges, models.DBOpDelete)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaMTOCategory, *metaDataType)
		}
		if suite.NotNil(categoryMeta) {
			if suite.NotNil(categoryMeta.ParentCategoryID) {
				suite.EqualValues(parentCategoryOld.ID, *categoryMeta.ParentCategoryID)
				if suite.NotNil(categoryMeta.ParentCategoryName) {
					suite.EqualValues(parentCategoryNameDBOld, *categoryMeta.ParentCategoryName)
				}

			}
		}

	})
	suite.Run("Category meta data doesn't fail when field isn't present in change set for Update, fetch category info from db", func() {
		categoryMeta, metaDataType, err := MTOCategoryMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, category.ID, emptyChanges, models.DBOpUpdate)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(categoryMeta) {
			if suite.NotNil(categoryMeta.ParentCategoryID) {
				suite.EqualValues(parentCategoryOld.ID, *categoryMeta.ParentCategoryID)
				if suite.NotNil(categoryMeta.ParentCategoryName) {
					suite.EqualValues(parentCategoryNameDBOld, *categoryMeta.ParentCategoryName)
				}

			}
		}
	})
	suite.Run("Category meta data doesn't fail when field isn't present in change set for DELETE, fetch filename from db", func() {

		suite.deleteMTOCategory(category.ID)

		categoryMeta, metaDataType, err := MTOCategoryMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, category.ID, emptyChanges, models.DBOpUpdate)
		suite.NoError(err)
		suite.NotNil(metaDataType)

		if suite.NotNil(categoryMeta) {
			suite.Nil(categoryMeta.ParentCategoryID)
			suite.Nil(categoryMeta.ParentCategoryName)
		}
	})
	suite.Run("Category meta data doesn't fails when field isn't present in change set for DELETE. If parent or category is not fetchable, data is null", func() {

		categoryMeta, metaDataType, err := MTOCategoryMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, category.ID, emptyChanges, models.DBOpDelete)
		suite.NoError(err)
		if suite.NotNil(metaDataType) {
			suite.EqualValues(models.TAMetaMTOCategory, *metaDataType)
		}

		if suite.NotNil(categoryMeta) {
			suite.Nil(categoryMeta.ParentCategoryID)
			suite.Nil(categoryMeta.ParentCategoryName)
		}
	})
}
