package translatedaudit

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// DiscussionReplyMetaDataGet uses the provided information to generate metadata needed for any discussion reply audits
func DiscussionReplyMetaDataGet(ctx context.Context, store *storage.Store, replyID interface{}, discussionID interface{}, auditTime time.Time) (*models.TranslatedAuditMetaDiscussionReply, error) {
	logger := appcontext.ZLogger(ctx)
	discussionUUID, err := parseInterfaceToUUID(discussionID)
	if err != nil {
		return nil, err
	}

	discussionWithReplies, err := storage.PlanDiscussionByIDWithNumberOfReplies(store, logger, discussionUUID, auditTime)
	if err != nil {
		return nil, fmt.Errorf("unable to get discussion by provided discussion ID for discussion reply translation metadata. err %w", err)
	}
	numOfReplies := discussionWithReplies.NumberOfReplies
	metaReply := models.NewTranslatedAuditMetaDiscussionReply("discussion_reply", 0, discussionWithReplies.ID, discussionWithReplies.Content.RawContent.String(), numOfReplies)
	return &metaReply, nil

}

// OperationalNeedMetaDataGet uses the provided information to generate metadata needed for any operational need audits
func OperationalNeedMetaDataGet(ctx context.Context, store *storage.Store, opNeedID interface{}) (*models.TranslatedAuditMetaOperationalNeed, error) {
	logger := appcontext.ZLogger(ctx)
	opNeedUUID, err := parseInterfaceToUUID(opNeedID)
	if err != nil {
		return nil, err
	}
	opNeed, err := store.OperationalNeedGetByID(logger, opNeedUUID)
	if err != nil {
		return nil, fmt.Errorf("unable to get operational need for operational need audit metadata. err %w", err)
	}

	metaNeed := models.NewTranslatedAuditMetaOperationalNeed("operational_need", 0, opNeed.GetName(), opNeed.GetIsOther())

	return &metaNeed, nil

}

// OperationalSolutionMetaDataGet uses the provided information to generate metadata needed for any operational solution audits
func OperationalSolutionMetaDataGet(ctx context.Context, store *storage.Store, opSolutionID interface{}) (*models.TranslatedAuditMetaOperationalSolution, *models.TranslatedAuditMetaDataType, error) {
	logger := appcontext.ZLogger(ctx)
	opSolutionUUID, err := parseInterfaceToUUID(opSolutionID)
	if err != nil {
		return nil, nil, err
	}
	opSolutionWithSubtasks, err := storage.OperationalSolutionGetByIDWithNumberOfSubtasks(store, logger, opSolutionUUID)
	if err != nil {
		return nil, nil, fmt.Errorf("unable to get operational solution with num of Subtasks for operational solution audit metadata. err %w", err)
	}

	opNeed, err := store.OperationalNeedGetByID(logger, opSolutionWithSubtasks.OperationalNeedID)
	if err != nil {
		return nil, nil, fmt.Errorf("unable to get operational need for operational solution audit metadata. err %w", err)
	}

	if err != nil {
		return nil, nil, fmt.Errorf("unable to get operational need for operational solution audit metadata. err %w", err)
	}

	metaNeed := models.NewTranslatedAuditMetaOperationalSolution(
		"operational_solution",
		0,
		opSolutionWithSubtasks.GetName(),
		opSolutionWithSubtasks.OtherHeader,
		opSolutionWithSubtasks.GetIsOther(),
		opSolutionWithSubtasks.NumberOfSubtasks,
		opNeed.GetName(),
		opNeed.GetIsOther(),
		opSolutionWithSubtasks.Status,
		opSolutionWithSubtasks.MustStartDts,
		opSolutionWithSubtasks.MustFinishDts,
	)
	metaType := models.TAMetaOperationalSolution

	return &metaNeed, &metaType, nil

}

// OperationalSolutionSubtaskMetaDataGet uses the provided information to generate metadata needed for any operational solution subtask audits.
// it checks if there is a name in the changes, and if so it sets that in the meta data, otherwise it will fetch it from the table record
func OperationalSolutionSubtaskMetaDataGet(ctx context.Context, store *storage.Store, opSolutionSubtaskID interface{}, opSolutionID interface{}, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaOperationalSolutionSubtask, error) {
	logger := appcontext.ZLogger(ctx)

	opSolutionUUID, err := parseInterfaceToUUID(opSolutionID)
	if err != nil {
		return nil, err
	}
	var subtaskName string
	nameChange, fieldPresent := changesFields["name"]
	if fieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			subtaskName = fmt.Sprint(nameChange.Old)
		} else {
			subtaskName = fmt.Sprint(nameChange.New)
		}

	} else {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			return nil, fmt.Errorf("there wasn't a name present for this subtask, unable to generate subtask metadata. Subtask %v", opSolutionSubtaskID)
		}
		opSolutionSubtaskUUID, err2 := parseInterfaceToUUID(opSolutionSubtaskID)
		if err2 != nil {
			return nil, err2
		}
		// Insert or update statements mean the subtask exists and can be fetched
		opSolSubtask, err3 := store.OperationalSolutionSubtaskGetByID(logger, opSolutionSubtaskUUID)
		if err != nil {
			return nil, fmt.Errorf("unable to get operational solution subtask operational solution subtask audit metadata. err %w", err3)
		}
		subtaskName = opSolSubtask.Name
	}

	opSolutionWithSubtasks, err := storage.OperationalSolutionGetByIDWithNumberOfSubtasks(store, logger, opSolutionUUID)
	if err != nil {
		return nil, fmt.Errorf("unable to get operational solution with num of Subtasks for operational solution subtask audit metadata. err %w", err)
	}

	opNeed, err := store.OperationalNeedGetByID(logger, opSolutionWithSubtasks.OperationalNeedID)
	if err != nil {
		return nil, fmt.Errorf("unable to get operational need for operational solution subtask audit metadata. err %w", err)
	}

	if err != nil {
		return nil, fmt.Errorf("unable to get operational need for operational solution subtask audit metadata. err %w", err)
	}

	metaNeed := models.NewTranslatedAuditMetaOperationalSolutionSubtask(
		"operational_solution_subtask",
		0,
		opSolutionWithSubtasks.GetName(),
		opSolutionWithSubtasks.OtherHeader,
		opSolutionWithSubtasks.GetIsOther(),
		opSolutionWithSubtasks.NumberOfSubtasks,
		opNeed.GetName(),
		opNeed.GetIsOther(),
		subtaskName,
	)

	return &metaNeed, nil

}

// DocumentSolutionLinkMetaDataGet returns meta data information
func DocumentSolutionLinkMetaDataGet(ctx context.Context, store *storage.Store, documentSolutionLinkID uuid.UUID, opSolutionID uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaDocumentSolutionLink, *models.TranslatedAuditMetaDataType, error) {
	// Handle the fields carefully here, this is a deletable entry, so we will lose the ability to query on delete
	logger := appcontext.ZLogger(ctx)

	var documentUUID uuid.UUID

	documentIDChange, fieldPresent := changesFields["document_id"]
	if !fieldPresent {
		//Changes: (Testing) verify this, we could also fetch the document solution link if it isn't a delete, but shouldn't need to
		return nil, nil, fmt.Errorf("there is no document_ID present in the changes object, this is needed for the document solution link translated audit")
	}
	var err error
	if operation == models.DBOpDelete || operation == models.DBOpTruncate {
		if documentIDChange.Old == nil {
			return nil, nil, fmt.Errorf("documentID was nil in the change field Old. A value was expected")
		}
		documentUUID, err = parseInterfaceToUUID(documentIDChange.Old)
		if err != nil {
			return nil, nil, err
		}
	} else {
		if documentIDChange.New == nil {
			return nil, nil, fmt.Errorf("documentID was nil in the change field New. A value was expected")
		}
		documentUUID, err = parseInterfaceToUUID(documentIDChange.New)
		if err != nil {
			return nil, nil, err
		}
	}
	if err != nil {
		return nil, nil, fmt.Errorf("unable to parse the document ID for this document solution link. err: %w", err)
	}

	// get the document
	document, err := storage.PlanDocumentGetByIDNoS3Check(store, logger, documentUUID)
	if err != nil {
		if err.Error() != "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			//Changes: (Meta) Handle if the document doesn't exist. If that is the case (EG no rows in result set)
			return nil, nil, fmt.Errorf("there was an issue getting the plan document for the . err %w", err)
		}
	}

	// 	//Changes: (Meta) should we check for the error differently? see if it is a wrapped error?

	opSolutionWithSubtasks, err := storage.OperationalSolutionGetByIDWithNumberOfSubtasks(store, logger, opSolutionID)
	if err != nil {
		return nil, nil, fmt.Errorf("unable to get operational solution with num of Subtasks for document solution link audit metadata. err %w", err)
	}

	opNeed, err := store.OperationalNeedGetByID(logger, opSolutionWithSubtasks.OperationalNeedID)
	if err != nil {
		return nil, nil, fmt.Errorf("unable to get operational need for document solution link audit metadata. err %w", err)
	}

	meta := models.NewTranslatedAuditMetaDocumentSolutionLink(
		"document_solution_link",
		0,
		opSolutionWithSubtasks.GetName(),
		opSolutionWithSubtasks.OtherHeader,
		opSolutionWithSubtasks.GetIsOther(),
		opNeed.GetName(),
		opNeed.GetIsOther(),
		documentUUID,
	)
	if document != nil {
		// Changes: (Meta) all these document fields will also need to be translated
		meta.SetOptionalDocumentFields(document.FileName, string(document.DocumentType), document.OtherTypeDescription, document.OptionalNotes, document.URL, fmt.Sprint(document.Restricted))
	}

	//Changes: (Meta) We need to get other document information, and it needs to be translated.

	metaType := models.TAMetaDocumentSolutionLink

	return &meta, &metaType, nil
}

func PlanCrTdlMetaDataGet(ctx context.Context, store *storage.Store, primaryKey uuid.UUID, tableName string, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {

	const idNumField = "id_number"
	var idNumber string
	idNumberChange, fieldPresent := changesFields[idNumField]
	if fieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			if idNumberChange.Old == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field Old. A value was expected", idNumField)
			}
			idNumber = fmt.Sprint(idNumberChange.Old)
		} else {
			if idNumberChange.New == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field New. A value was expected", idNumField)
			}
			idNumber = fmt.Sprint(idNumberChange.New)
		}
	} else {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			return nil, nil, fmt.Errorf("the %s field, wasn't present on the audit change, and the data is deleted, and not queryable", idNumField)
		}
		switch tableName {
		case "plan_cr":
			logger := appcontext.ZLogger(ctx)
			planCR, err := store.PlanCRGetByID(logger, primaryKey)
			if err != nil {
				return nil, nil, err
			}
			if planCR == nil {
				return nil, nil, fmt.Errorf("planCR is not present in the database, but expected for this meta data")
			}
			idNumber = planCR.IDNumber
		case "plan_tdl":
			logger := appcontext.ZLogger(ctx)
			planTDL, err := store.PlanTDLGetByID(logger, primaryKey)
			if err != nil {
				return nil, nil, err
			}
			if planTDL == nil {
				return nil, nil, fmt.Errorf("planTDL is not present in the database, but expected for this meta data")
			}
			idNumber = planTDL.IDNumber
		default:
			return nil, nil, fmt.Errorf("unable to get plan_cr / plan_tdl meta data with this table type %s", tableName)
		}

	}

	//Changes: (Meta) Should we break this into two functions?. Also should we define a specific meta data type?
	meta := models.NewTranslatedAuditMetaGeneric(tableName, 0, "id_number", idNumber)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

func PlanCollaboratorMetaDataGet(ctx context.Context, store *storage.Store, primaryKey uuid.UUID, tableName string, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {
	const userIDField = "user_id"
	var userUUID uuid.UUID
	userIDChange, fieldPresent := changesFields[userIDField]
	if fieldPresent {
		var err error
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			if userIDChange.Old == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field Old. A value was expected", userIDField)
			}
			userUUID, err = parseInterfaceToUUID(userIDChange.Old)
			if err != nil {
				return nil, nil, err
			}
		} else {
			if userIDChange.New == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field New. A value was expected", userIDField)
			}
			userUUID, err = parseInterfaceToUUID(userIDChange.New)
			if err != nil {
				return nil, nil, err
			}
		}
	} else {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			return nil, nil, fmt.Errorf("the %s field, wasn't present on the audit change, and the data is deleted, and not queryable", userIDField)
		}

		collab, err := store.PlanCollaboratorGetByID(primaryKey)
		if err != nil {
			return nil, nil, err
		}
		if collab == nil {
			return nil, nil, fmt.Errorf("collaborator is not present in the database, but expected for this meta data")
		}
		userUUID = collab.UserID

	}

	userAccount, err := storage.UserAccountGetByID(store, userUUID)
	if err != nil {
		return nil, nil, fmt.Errorf("could not retrieve user account for plan collaborator audit metadata. err %w", err)
	}

	meta := models.NewTranslatedAuditMetaGeneric(tableName, 0, "UserName", userAccount.CommonName)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

// PlanDocumentMetaDataGet gets meta data for a plan document translated audit entry.
// it first checks if the field is present in the change set, and if not, will fetch the record from the database
// by checking the change set first, we are able to set meta data for records that have already been deleted
func PlanDocumentMetaDataGet(ctx context.Context, store *storage.Store, documentID uuid.UUID, tableName string, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {
	// Changes: (Meta) is file_name the only field we need here? What if it is a link? Should we fetch from the db instead? NOTE, we can't fetch that when the document is deleted however
	const fileNameField = "file_name"
	var fileName string
	fileNameChange, fieldPresent := changesFields[fileNameField]
	if fieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			if fileNameChange.Old == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field Old. A value was expected", fileNameField)
			}
			fileName = fmt.Sprint(fileNameChange.Old)

		} else {
			if fileNameChange.New == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field New. A value was expected", fileNameField)
			}
			fileName = fmt.Sprint(fileNameChange.New)

		}
	} else {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			return nil, nil, fmt.Errorf("the %s field, wasn't present on the audit change, and the data is deleted, and not queryable", fileNameField)
		}
		logger := appcontext.ZLogger(ctx)
		document, err := storage.PlanDocumentGetByIDNoS3Check(store, logger, documentID)
		if err != nil {
			if err.Error() != "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error

				return nil, nil, fmt.Errorf("there was an issue getting the plan document for the . err %w", err)
			}
		}

		if document == nil {
			return nil, nil, fmt.Errorf("document is not present in the database, but expected for this meta data")
		}
		fileName = document.FileName

	}

	meta := models.NewTranslatedAuditMetaGeneric(tableName, 0, "fileName", fileName)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

func TranslatedAuditMetaData(ctx context.Context, store *storage.Store, audit *models.AuditChange, operation models.DatabaseOperation) (models.TranslatedAuditMetaData, *models.TranslatedAuditMetaDataType, error) {
	// Changes: (ChChCh Changes!) Consider, do we need to handle if something is deleted differently? There might not be fetch-able information...
	switch audit.TableName {
	// Changes: (Testing) add a test for each of these.

	//Changes: (Meta) refactor all of these to explicitly take UUIDs, since primary and foreignKey are always UUIDs and not interfaces. We don't need to parse them
	// Changes: (Meta) Audit these method signatures, refactor to have a cohesive unified signature throughout, and remove any unnecessary params
	case "discussion_reply":
		metaData, err := DiscussionReplyMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.ModifiedDts)
		metaDataType := models.TAMetaDiscussionReply
		return metaData, &metaDataType, err
	case "operational_need":
		metaData, err := OperationalNeedMetaDataGet(ctx, store, audit.PrimaryKey)
		metaDataType := models.TAMetaOperationalNeed
		return metaData, &metaDataType, err
	case "operational_solution":
		metaData, metaDataType, err := OperationalSolutionMetaDataGet(ctx, store, audit.PrimaryKey)
		return metaData, metaDataType, err
	case "operational_solution_subtask":
		metaData, err := OperationalSolutionSubtaskMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.Fields, operation)
		metaDataType := models.TAMetaOperationalSolutionSubtask
		return metaData, &metaDataType, err
	case "plan_document_solution_link":
		metaData, metaDataType, err := DocumentSolutionLinkMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.Fields, operation)
		return metaData, metaDataType, err
	case "plan_cr", "plan_tdl":
		metaData, metaDataType, err := PlanCrTdlMetaDataGet(ctx, store, audit.PrimaryKey, audit.TableName, audit.Fields, operation)
		return metaData, metaDataType, err
	case "plan_collaborator":
		metaData, metaDataType, err := PlanCollaboratorMetaDataGet(ctx, store, audit.PrimaryKey, audit.TableName, audit.Fields, operation)
		return metaData, metaDataType, err
	case "plan_document":
		metaData, metaDataType, err := PlanDocumentMetaDataGet(ctx, store, audit.PrimaryKey, audit.TableName, audit.Fields, operation)
		return metaData, metaDataType, err

	default:
		// Tables that aren't configured to generate meta data will return nil
		return nil, nil, nil
	}

}
