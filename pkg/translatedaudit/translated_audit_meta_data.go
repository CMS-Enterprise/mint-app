package translatedaudit

import (
	"context"
	"database/sql"
	"errors"
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

	const statusKey = "status"
	translatedStatus := getTranslationMapAndTranslateSingleValue("operational_solution", statusKey, fmt.Sprint(opSolutionWithSubtasks.Status))

	metaNeed := models.NewTranslatedAuditMetaOperationalSolution(
		"operational_solution",
		0,
		opSolutionWithSubtasks.GetName(),
		opSolutionWithSubtasks.OtherHeader,
		opSolutionWithSubtasks.GetIsOther(),
		opSolutionWithSubtasks.NumberOfSubtasks,
		opNeed.GetName(),
		opNeed.GetIsOther(),
		translatedStatus,
		opSolutionWithSubtasks.MustStartDts,
		opSolutionWithSubtasks.MustFinishDts,
	)
	metaType := models.TAMetaOperationalSolution

	return &metaNeed, &metaType, nil

}

// OperationalSolutionSubtaskMetaDataGet uses the provided information to generate metadata needed for any operational solution subtask audits.
// it checks if there is a name in the changes, and if so it sets that in the meta data, otherwise it will fetch it from the table record
func OperationalSolutionSubtaskMetaDataGet(ctx context.Context, store *storage.Store, opSolutionSubtaskID uuid.UUID, opSolutionID uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaOperationalSolutionSubtask, error) {
	logger := appcontext.ZLogger(ctx)

	var subtaskName *string
	nameChange, fieldPresent := changesFields["name"]
	if fieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			subtaskName = models.StringPointer(fmt.Sprint(nameChange.Old))
		} else {
			subtaskName = models.StringPointer(fmt.Sprint(nameChange.New))
		}

	} else {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			return nil, fmt.Errorf("there wasn't a name present for this subtask, unable to generate subtask metadata. Subtask %v", opSolutionSubtaskID)
		}

		// Insert or update statements mean the subtask should exist and can be fetched (unless it was deleted before the translation can occur)
		opSolSubtask, err3 := store.OperationalSolutionSubtaskGetByID(logger, opSolutionSubtaskID)
		if err3 != nil {
			if !errors.Is(err3, sql.ErrNoRows) {
				return nil, fmt.Errorf("unable to get operational solution subtask operational solution subtask audit metadata. err %w", err3)
			} else {
				subtaskName = nil
			}
		} else {
			subtaskName = &opSolSubtask.Name
		}

	}

	opSolutionWithSubtasks, err := storage.OperationalSolutionGetByIDWithNumberOfSubtasks(store, logger, opSolutionID)
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
	document, docErr := storage.PlanDocumentGetByIDNoS3Check(store, logger, documentUUID)
	if docErr != nil {
		//EXPECT THERE TO BE NULL results, don't treat this as an error
		if !errors.Is(docErr, sql.ErrNoRows) {
			return nil, nil, fmt.Errorf("there was an issue getting the plan document for the . err %w", docErr)
		}
	}

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

		// Future Enhancement: This could be more efficient by sharing the translation, but currently leaving like this for simplicity
		const restrictedKey = "restricted"
		translatedDocRestricted := getTranslationMapAndTranslateSingleValue("plan_document", restrictedKey, fmt.Sprint(document.Restricted))

		const typeKey = "document_type"
		translatedDocType := getTranslationMapAndTranslateSingleValue("plan_document", typeKey, fmt.Sprint(document.DocumentType))

		meta.SetOptionalDocumentFields(document.FileName, translatedDocType, document.OtherTypeDescription, document.OptionalNotes, document.URL, translatedDocRestricted, document.Restricted)
	}

	metaType := models.TAMetaDocumentSolutionLink

	return &meta, &metaType, nil
}

func PlanCrTdlMetaDataGet(ctx context.Context, store *storage.Store, primaryKey uuid.UUID, tableName string, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {

	const idNumField = "id_number"
	var idNumber *string
	idNumberChange, fieldPresent := changesFields[idNumField]
	if fieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			if idNumberChange.Old == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field Old. A value was expected", idNumField)
			}
			idNumber = models.StringPointer(fmt.Sprint(idNumberChange.Old))
		} else {
			if idNumberChange.New == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field New. A value was expected", idNumField)
			}
			idNumber = models.StringPointer(fmt.Sprint(idNumberChange.New))
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
			if planCR != nil {
				idNumber = &planCR.IDNumber
			}

		case "plan_tdl":
			logger := appcontext.ZLogger(ctx)
			planTDL, err := store.PlanTDLGetByID(logger, primaryKey)
			if err != nil {
				return nil, nil, err
			}
			if planTDL != nil {
				idNumber = &planTDL.IDNumber
			}

		default:
			return nil, nil, fmt.Errorf("unable to get plan_cr / plan_tdl meta data with this table type %s", tableName)
		}

	}

	meta := models.NewTranslatedAuditMetaGeneric(tableName, 0, "id_number", idNumber)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

func PlanCollaboratorMetaDataGet(ctx context.Context, store *storage.Store, primaryKey uuid.UUID, tableName string, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {
	const userIDField = "user_id"
	var userUUID uuid.UUID
	var userName *string
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

		collab, collabErr := store.PlanCollaboratorGetByID(primaryKey)
		if collabErr != nil {
			if !errors.Is(collabErr, sql.ErrNoRows) {
				return nil, nil, collabErr
			}
		}
		if collab != nil {
			userUUID = collab.UserID
		}

	}

	if userUUID != uuid.Nil {
		userAccount, err := storage.UserAccountGetByID(store, userUUID)
		if err != nil {
			return nil, nil, fmt.Errorf("could not retrieve user account for plan collaborator audit metadata. err %w", err)
		}
		userName = &userAccount.CommonName
	}

	meta := models.NewTranslatedAuditMetaGeneric(tableName, 0, "UserName", userName)
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

		// If the data isn't present, don't error, just have document name be nil
		// if operation == models.DBOpDelete || operation == models.DBOpTruncate {
		// 	return nil, nil, fmt.Errorf("the %s field, wasn't present on the audit change, and the data is deleted, and not queryable", fileNameField)
		// }
		logger := appcontext.ZLogger(ctx)
		document, docErr := storage.PlanDocumentGetByIDNoS3Check(store, logger, documentID)
		if docErr != nil {
			if !errors.Is(docErr, sql.ErrNoRows) {
				//EXPECT THERE TO BE NULL results, don't treat this as an error

				return nil, nil, fmt.Errorf("there was an issue getting the plan document for the . err %w", docErr)
			}
		}

		if document != nil {
			fileName = document.FileName
			// return nil, nil, fmt.Errorf("document is not present in the database, but expected for this meta data")
		}

	}

	meta := models.NewTranslatedAuditMetaGeneric(tableName, 0, "fileName", &fileName)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

// SetTranslatedAuditTableSpecificMetaData does table specific analysis to
// 1. Get meta data where needed
// 2. Set the needed restriction level of an audit.
// It returns a bool to say if anything was modified and an error if encountered
func SetTranslatedAuditTableSpecificMetaData(ctx context.Context, store *storage.Store, tAuditWithFields *models.TranslatedAuditWithTranslatedFields, audit *models.AuditChange, operation models.DatabaseOperation) (bool, error) {

	var metaDataInterface models.TranslatedAuditMetaData
	var metaDataTypeGlobal *models.TranslatedAuditMetaDataType
	// the default state is not-restricted
	var restricted bool
	switch audit.TableName {
	//Changes: (Meta) refactor all of these to explicitly take UUIDs, since primary and foreignKey are always UUIDs and not interfaces. We don't need to parse them
	// Changes: (Meta) Audit these method signatures, refactor to have a cohesive unified signature throughout, and remove any unnecessary params
	case "discussion_reply":
		metaData, err := DiscussionReplyMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.ModifiedDts)
		metaDataType := models.TAMetaDiscussionReply
		metaDataInterface = metaData
		metaDataTypeGlobal = &metaDataType
		if err != nil {
			return true, err
		}
	case "operational_need":
		metaData, err := OperationalNeedMetaDataGet(ctx, store, audit.PrimaryKey)
		metaDataType := models.TAMetaOperationalNeed
		metaDataInterface = metaData
		metaDataTypeGlobal = &metaDataType
		if err != nil {
			return true, err
		}
	case "operational_solution":
		metaData, metaDataType, err := OperationalSolutionMetaDataGet(ctx, store, audit.PrimaryKey)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case "operational_solution_subtask":
		metaData, err := OperationalSolutionSubtaskMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.Fields, operation)
		metaDataType := models.TAMetaOperationalSolutionSubtask
		metaDataInterface = metaData
		metaDataTypeGlobal = &metaDataType
		if err != nil {
			return true, err
		}
	case "plan_document_solution_link":
		metaData, metaDataType, err := DocumentSolutionLinkMetaDataGet(ctx, store, audit.PrimaryKey, audit.ForeignKey, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
		// this looks for meta data, maybe just pass it in directly?
		isRestricted, err := checkIfDocumentLinkIsRestricted(metaData)
		if err != nil {
			return true, err
		}
		restricted = isRestricted

	case "plan_cr", "plan_tdl":
		metaData, metaDataType, err := PlanCrTdlMetaDataGet(ctx, store, audit.PrimaryKey, audit.TableName, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case "plan_collaborator":
		metaData, metaDataType, err := PlanCollaboratorMetaDataGet(ctx, store, audit.PrimaryKey, audit.TableName, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case "plan_document":
		metaData, metaDataType, err := PlanDocumentMetaDataGet(ctx, store, audit.PrimaryKey, audit.TableName, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
		isRestricted, err := checkIfDocumentIsRestricted(tAuditWithFields.TranslatedFields, operation)
		if err != nil {
			return true, err
		}
		restricted = isRestricted
	default:
		// Tables that aren't configured to generate meta data, or to be restricted will return nil
		return false, nil
	}

	tAuditWithFields.MetaData = metaDataInterface
	tAuditWithFields.MetaDataType = metaDataTypeGlobal
	tAuditWithFields.Restricted = restricted

	return true, nil
}
