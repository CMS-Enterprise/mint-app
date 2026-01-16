package translatedaudit

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// DiscussionReplyMetaDataGet uses the provided information to generate metadata needed for any discussion reply audits
func DiscussionReplyMetaDataGet(ctx context.Context, store *storage.Store, discussionID uuid.UUID, auditTime time.Time) (*models.TranslatedAuditMetaDiscussionReply, error) {
	logger := appcontext.ZLogger(ctx)

	discussionWithReplies, err := storage.PlanDiscussionByIDWithNumberOfReplies(store, logger, discussionID, auditTime)
	if err != nil {
		return nil, fmt.Errorf("unable to get discussion by provided discussion ID for discussion reply translation metadata. err %w", err)
	}
	numOfReplies := discussionWithReplies.NumberOfReplies
	metaReply := models.NewTranslatedAuditMetaDiscussionReply(0, discussionWithReplies.ID, discussionWithReplies.Content.RawContent.String(), numOfReplies)
	return &metaReply, nil

}

func PlanCrTdlMetaDataGet(ctx context.Context, store *storage.Store, primaryKey uuid.UUID, tableName models.TableName, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {

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

func PlanCollaboratorMetaDataGet(ctx context.Context, store *storage.Store, primaryKey uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {
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

	meta := models.NewTranslatedAuditMetaGeneric(models.TNPlanCollaborator, 0, "UserName", userName)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

// PlanDocumentMetaDataGet gets meta data for a plan document translated audit entry.
// it first checks if the field is present in the change set, and if not, will fetch the record from the database
// by checking the change set first, we are able to set meta data for records that have already been deleted
func PlanDocumentMetaDataGet(ctx context.Context, store *storage.Store, documentID uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {
	const fileNameField = "file_name"
	var fileName *string
	fileNameChange, fieldPresent := changesFields[fileNameField]
	if fieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			if fileNameChange.Old == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field Old. A value was expected", fileNameField)
			}
			fileNameOld := fmt.Sprint(fileNameChange.Old)
			fileName = &fileNameOld

		} else {
			if fileNameChange.New == nil {
				return nil, nil, fmt.Errorf("%s was nil in the change field New. A value was expected", fileNameField)
			}
			fileNameNew := fmt.Sprint(fileNameChange.New)
			fileName = &fileNameNew
		}
	} else {

		logger := appcontext.ZLogger(ctx)
		document, docErr := storage.PlanDocumentGetByIDNoS3Check(store, logger, documentID)
		if docErr != nil {
			if !errors.Is(docErr, sql.ErrNoRows) {
				//EXPECT THERE TO BE NULL results, don't treat this as an error

				return nil, nil, fmt.Errorf("there was an issue getting the plan document for the . err %w", docErr)
			}
		}

		if document != nil {
			fileName = &document.FileName
		}

	}
	meta := models.NewTranslatedAuditMetaGeneric(models.TNPlanDocument, 0, "fileName", fileName)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

// MTOMilestoneMetaDataGet relies on the changes field to return name information. If not available, it will attempt to fetch a milestone to get it's current name.
func MTOMilestoneMetaDataGet(ctx context.Context, store *storage.Store, milestoneID uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {

	// the data is deletable, so it needs to be a pointer
	var name *string
	nameChange, nameFieldPresent := changesFields["name"]
	keyChange, keyFieldPresent := changesFields["mto_common_milestone_key"]
	if nameFieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			name = models.StringPointer(fmt.Sprint(nameChange.Old))
		} else {
			name = models.StringPointer(fmt.Sprint(nameChange.New))
		}

	} else if keyFieldPresent {
		var commonMilestoneKey any
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			commonMilestoneKey = keyChange.Old
		} else {
			commonMilestoneKey = keyChange.New
		}
		milestoneName, err := getMTOCommonMilestoneForeignKeyReference(ctx, store, commonMilestoneKey)
		if err != nil {
			return nil, nil, fmt.Errorf("there was an issue getting the common milestone meta data for mto milestone. err %w", err)
		}
		name = &milestoneName

	} else {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			return nil, nil, fmt.Errorf("there wasn't a name present for this MTO milestone, unable to generate metadata for this entry. MTO Milestone %v", milestoneID)
		}
		// Handle the fields carefully here, this is a deletable entry, so we will lose the ability to query on delete
		milestone, err := loaders.MTOMilestone.ByID.Load(ctx, milestoneID)
		if err != nil {
			if !errors.Is(err, loaders.ErrRecordNotFoundForKey) {
				return nil, nil, fmt.Errorf("there was an issue getting meta data for mto milestone. err %w", err)
			} else { // expect that a nil milestone can be returned under this circumstance.
				name = nil
			}

		} else {
			name = milestone.Name
		}

	}

	meta := models.NewTranslatedAuditMetaGeneric(models.TNMTOMilestone, 0, "name", name)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

// MTOMilestoneNoteMetaDataGet relies on the changes field to return content and milestone information. If not available, it will attempt to fetch a milestone note to get its current content and related milestone name.
func MTOMilestoneNoteMetaDataGet(ctx context.Context, store *storage.Store, milestoneNoteID uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {

	// the data is deletable, so it needs to be a pointer
	var milestoneName *string

	milestoneIDChange, milestoneIDFieldPresent := changesFields["milestone_id"]

	operationIsDelete := operation == models.DBOpDelete || operation == models.DBOpTruncate

	// Get milestone name from the milestone_id field
	if milestoneIDFieldPresent {
		var milestoneID any
		if operationIsDelete {
			milestoneID = milestoneIDChange.Old
		} else {
			milestoneID = milestoneIDChange.New
		}

		// Guard against nil milestone ID values
		if milestoneID == nil {
			return nil, nil, fmt.Errorf("milestone_id field present but value is nil (operation: %s, milestoneNoteID: %v)", operation, milestoneNoteID)
		}

		milestoneNameStr, err := getMTOMilestoneForeignKeyReference(ctx, store, milestoneID)
		if err != nil {
			return nil, nil, fmt.Errorf("there was an issue getting the milestone name for mto milestone note (operation: %s, milestoneNoteID: %v). err %w", operation, milestoneNoteID, err)
		}
		milestoneName = &milestoneNameStr
	}

	// If we don't have the milestone ID from changes, fetch from database
	if !milestoneIDFieldPresent {
		if operationIsDelete {
			return nil, nil, fmt.Errorf("there wasn't enough information present for this MTO milestone note, unable to generate metadata for this entry (operation: %s, milestoneNoteID: %v)", operation, milestoneNoteID)
		}

		// Handle the fields carefully here, this is a deletable entry, so we will lose the ability to query on delete
		milestoneNote, err := loaders.MTOMilestoneNote.ByID.Load(ctx, milestoneNoteID)
		if err != nil {
			if !errors.Is(err, loaders.ErrRecordNotFoundForKey) {
				return nil, nil, fmt.Errorf("there was an issue getting meta data for mto milestone note (operation: %s, milestoneNoteID: %v). err %w", operation, milestoneNoteID, err)
			} else { // expect that a nil milestone note can be returned under this circumstance.
				milestoneName = nil
			}
		} else {
			if milestoneName == nil {
				milestoneNameStr, err := getMTOMilestoneForeignKeyReference(ctx, store, milestoneNote.MilestoneID)
				if err != nil {
					return nil, nil, fmt.Errorf("there was an issue getting the milestone name for mto milestone note (operation: %s, milestoneNoteID: %v). err %w", operation, milestoneNoteID, err)
				}
				milestoneName = &milestoneNameStr
			}
		}
	}

	meta := models.NewTranslatedAuditMetaGeneric(models.TNMTOMilestone, 0, "name", milestoneName)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

// MTOSolutionMetaDataGet relies on the changes field to return name information. If not available, it will attempt to fetch a solution to get it's current name.
func MTOSolutionMetaDataGet(ctx context.Context, store *storage.Store, solutionID uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaGeneric, *models.TranslatedAuditMetaDataType, error) {

	// the data is deletable, so it needs to be a pointer
	var name *string
	nameChange, fieldPresent := changesFields["name"]
	keyChange, keyFieldPresent := changesFields["mto_common_solution_key"]
	if fieldPresent {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			name = models.StringPointer(fmt.Sprint(nameChange.Old))
		} else {
			name = models.StringPointer(fmt.Sprint(nameChange.New))
		}

	} else if keyFieldPresent {
		var commonSolutionKey any
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			commonSolutionKey = keyChange.Old
		} else {
			commonSolutionKey = keyChange.New
		}
		solutionName, err := getMTOCommonSolutionForeignKeyReference(ctx, store, commonSolutionKey)
		if err != nil {
			return nil, nil, fmt.Errorf("there was an issue getting the common solution meta data for this mto solution. err %w", err)
		}
		name = &solutionName

	} else {
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			return nil, nil, fmt.Errorf("there wasn't a name present for this MTO solution, unable to generate metadata for this entry. MTO solution %v", solutionID)
		}
		// Handle the fields carefully here, this is a deletable entry, so we will lose the ability to query on delete
		solution, err := loaders.MTOSolution.ByID.Load(ctx, solutionID)
		if err != nil {
			if !errors.Is(err, loaders.ErrRecordNotFoundForKey) {
				return nil, nil, fmt.Errorf("there was an issue getting meta data for mto solution. err %w", err)
			} else { // expect that a nil solution can be returned under this circumstance.
				name = nil
			}

		} else {
			name = solution.Name
		}

	}

	meta := models.NewTranslatedAuditMetaGeneric(models.TNMTOSolution, 0, "name", name)
	metaType := models.TAMetaGeneric
	return &meta, &metaType, nil
}

// MTOCategoryMetaDataGet uses the provided information to generate metadata needed for any mto category audits
func MTOCategoryMetaDataGet(ctx context.Context, store *storage.Store, categoryID uuid.UUID, changesFields models.AuditFields, operation models.DatabaseOperation) (*models.TranslatedAuditMetaMTOCategory, *models.TranslatedAuditMetaDataType, error) {

	// get the Category
	var parentCategoryID *uuid.UUID
	var parentName *string
	var category *models.MTOCategory
	var categoryName *string
	var categoryWasFetched bool
	parentIDChange, parentIDFieldPresent := changesFields["parent_id"]
	nameChange, nameFieldPresent := changesFields["name"]
	if parentIDFieldPresent {
		var parentCategoryIDString string
		if operation == models.DBOpDelete || operation == models.DBOpTruncate {
			parentCategoryIDString = fmt.Sprint(parentIDChange.Old)
		} else {
			parentCategoryIDString = fmt.Sprint(parentIDChange.New)
		}
		parentCategoryIDtemp, err := uuid.Parse(parentCategoryIDString)
		if err != nil {
			return nil, nil, fmt.Errorf("there was an issue getting meta data for mto category. Unable to parse uuid err %w", err)
		}
		parentCategoryID = &parentCategoryIDtemp
	} else {
		// Note, if a parent id wasn't set and deleted, it is excluded from the audit as it is unchanged. EG null --> null never shows up in the audit.

		// attempt to fetch the category, and get parent id from the entry
		retCategory, err := loaders.MTOCategory.ByID.Load(ctx, categoryID)
		if err != nil {
			if !errors.Is(err, loaders.ErrRecordNotFoundForKey) { // this can be nil if the category was deleted
				return nil, nil, fmt.Errorf("there was an issue getting meta data for mto category. err %w", err)
			}
		}
		categoryWasFetched = true
		if retCategory != nil {
			category = retCategory
			parentCategoryID = retCategory.ParentID
		}

	}
	// prioritize the field change itself, fetch the category if needed
	if nameFieldPresent {
		if nameFieldPresent {
			if operation == models.DBOpDelete || operation == models.DBOpTruncate {
				categoryName = models.StringPointer(fmt.Sprint(nameChange.Old))
			} else {
				categoryName = models.StringPointer(fmt.Sprint(nameChange.New))
			}

		}
	} else {
		if !categoryWasFetched {
			retCategory, err := loaders.MTOCategory.ByID.Load(ctx, categoryID)
			if err != nil {
				if !errors.Is(err, loaders.ErrRecordNotFoundForKey) { // this can be nil if the category was deleted
					return nil, nil, fmt.Errorf("there was an issue getting meta data for mto category. err %w", err)
				}
			}
			category = retCategory
		}

		if category != nil {
			categoryName = helpers.PointerTo(category.Name)
		}
	}

	// get the parent category name if possible. This can fail if the parent was deleted
	if parentCategoryID != nil {
		parentCategory, err := loaders.MTOCategory.ByID.Load(ctx, *parentCategoryID)
		if err != nil {
			if !errors.Is(err, loaders.ErrRecordNotFoundForKey) {
				return nil, nil, fmt.Errorf("there was an issue getting the parent category for mto category. err %w", err)
			} else { // expect that a nil category can be returned under this circumstance.
				parentName = nil
			}

		} else {
			parentName = &parentCategory.Name
		}

	}

	metaNeed := models.NewTranslatedAuditMetaMTOCategory(0, categoryName, parentName, parentCategoryID)
	metaType := models.TAMetaMTOCategory
	return &metaNeed, &metaType, nil

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

	case "discussion_reply":
		metaData, err := DiscussionReplyMetaDataGet(ctx, store, audit.ForeignKey, audit.ModifiedDts)
		metaDataType := models.TAMetaDiscussionReply
		metaDataInterface = metaData
		metaDataTypeGlobal = &metaDataType
		if err != nil {
			return true, err
		}

	case "plan_cr", "plan_tdl":
		metaData, metaDataType, err := PlanCrTdlMetaDataGet(ctx, store, audit.PrimaryKey, audit.TableName, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case "plan_collaborator":
		metaData, metaDataType, err := PlanCollaboratorMetaDataGet(ctx, store, audit.PrimaryKey, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case "plan_document":
		metaData, metaDataType, err := PlanDocumentMetaDataGet(ctx, store, audit.PrimaryKey, audit.Fields, operation)
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
	case models.TNMTOCategory:
		metaData, metaDataType, err := MTOCategoryMetaDataGet(ctx, store, audit.PrimaryKey, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case models.TNMTOMilestone:
		metaData, metaDataType, err := MTOMilestoneMetaDataGet(ctx, store, audit.PrimaryKey, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case models.TNMTOSolution:
		metaData, metaDataType, err := MTOSolutionMetaDataGet(ctx, store, audit.PrimaryKey, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	case models.TNMTOMilestoneNote:
		metaData, metaDataType, err := MTOMilestoneNoteMetaDataGet(ctx, store, audit.PrimaryKey, audit.Fields, operation)
		metaDataInterface = metaData
		metaDataTypeGlobal = metaDataType
		if err != nil {
			return true, err
		}
	default:
		// Tables that aren't configured to generate meta data, or to be restricted will return nil
		return false, nil
	}

	tAuditWithFields.MetaData = metaDataInterface
	tAuditWithFields.MetaDataType = metaDataTypeGlobal
	tAuditWithFields.Restricted = restricted

	return true, nil
}
