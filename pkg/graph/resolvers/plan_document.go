package resolvers

import (
	"context"
	"fmt"
	"net/url"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
)

// PlanDocumentCreate implements resolver logic to upload the specified file to S3 and create a matching plan document entity in the database.
func PlanDocumentCreate(logger *zap.Logger, input *model.PlanDocumentInput, principal authentication.Principal, store *storage.Store, s3Client *s3.S3Client) (*models.PlanDocument, error) {
	err := validatePlanDocumentTaskAttribution(store, logger, input.ModelPlanID, input.PlanTaskID)
	if err != nil {
		return nil, err
	}

	createdDoc := models.NewPlanDocument(principal.Account().ID, input.ModelPlanID, input.FileData.ContentType, *s3Client.GetBucket(), uuid.NewString(), input.FileData.Filename, int(input.FileData.Size), input.DocumentType, input.Restricted, input.PlanTaskID, zero.StringFromPtr(input.OtherTypeDescription), zero.StringFromPtr(input.OptionalNotes), false, zero.String{})

	err = BaseStructPreCreate(logger, createdDoc, principal, store, true)
	if err != nil {
		return nil, err
	}

	err = s3Client.UploadFile(context.TODO(), input.FileData.File, createdDoc.FileKey)
	if err != nil {
		return &models.PlanDocument{}, err
	}

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.PlanDocument, error) {
		document, err := storage.PlanDocumentCreate(tx, logger, principal.ID(), createdDoc)
		if err != nil {
			return nil, genericmodel.HandleModelCreationError(logger, err, createdDoc)
		}

		return document, nil
	})
}

// PlanDocumentCreateLinked creates a plan document which is a link to an external URL instead of an Uploaded file
func PlanDocumentCreateLinked(logger *zap.Logger, input model.PlanDocumentLinkInput, principal authentication.Principal, store *storage.Store) (*models.PlanDocument, error) {
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.PlanDocument, error) {
		err := validatePlanDocumentTaskAttribution(tx, logger, input.ModelPlanID, input.PlanTaskID)
		if err != nil {
			return nil, err
		}

		contentType := "externalLink"
		fileSize := 0
		u, err := url.Parse(input.URL)
		if err != nil {
			return nil, fmt.Errorf(" url is not in a valid format. err : %w", err)
		}
		// Ensure the URL has a host specified and is not a relative link
		if u.Host == "" {
			return nil, fmt.Errorf(" url does not have a host specified. Please create a valid absolute reference. url : %s ", input.URL)
		}

		// Ensure the URL has a scheme of either http or https
		if u.Scheme != "http" && u.Scheme != "https" {
			return nil, fmt.Errorf(" url does not have a valid scheme. It should begin with http or https. url : %s ", input.URL)
		}
		createdDoc := models.NewPlanDocument(principal.Account().ID, input.ModelPlanID, contentType, contentType, contentType, input.Name, fileSize, input.DocumentType, input.Restricted, input.PlanTaskID, zero.StringFromPtr(input.OtherTypeDescription), zero.StringFromPtr(input.OptionalNotes), true, zero.StringFrom(input.URL))

		err = BaseStructPreCreate(logger, createdDoc, principal, tx, true)
		if err != nil {
			return nil, err
		}

		document, err := storage.PlanDocumentCreate(tx, logger, principal.ID(), createdDoc)
		if err != nil {
			return nil, genericmodel.HandleModelCreationError(logger, err, createdDoc)
		}

		return document, nil
	})
}

func validatePlanDocumentTaskAttribution(np sqlutils.NamedPreparer, logger *zap.Logger, modelPlanID uuid.UUID, planTaskID *uuid.UUID) error {
	if planTaskID == nil {
		return nil
	}

	tasks, err := storage.PlanTaskGetByIDLoader(np, logger, []uuid.UUID{*planTaskID})
	if err != nil {
		return err
	}
	if len(tasks) != 1 {
		return fmt.Errorf("plan task %s not found", planTaskID.String())
	}
	if tasks[0].ModelPlanID != modelPlanID {
		return fmt.Errorf("plan task %s does not belong to model plan %s", planTaskID.String(), modelPlanID.String())
	}

	return nil
}

// PlanDocumentRead implements resolver logic to fetch a plan document object by ID
func PlanDocumentRead(logger *zap.Logger, store *storage.Store, s3Client *s3.S3Client, id uuid.UUID) (*models.PlanDocument, error) {
	document, err := storage.PlanDocumentRead(store, logger, s3Client, id)
	if err != nil {
		return nil, err
	}

	return document, nil
}

// PlanDocumentsReadByModelPlanID implements resolver logic to fetch a plan document object by model plan ID
func PlanDocumentsReadByModelPlanID(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store, s3Client *s3.S3Client) ([]*models.PlanDocument, error) {

	isCollaborator, err := accesscontrol.IsCollaboratorModelPlanID(logger, principal, store, id)
	if err != nil {
		return nil, err
	}
	//Future Enhancement refactor this to use HasPrivilegedDocumentAccessByModelPlanID

	// Non-collaborators OR anyone with the Non-CMS User job code cannot see restricted documents
	if !isCollaborator || principal.AllowNonCMSUser() {
		notRestrictedDocuments, err := storage.PlanDocumentsReadByModelPlanIDNotRestricted(store, logger, id, s3Client)

		if err != nil {
			return nil, err
		}

		return notRestrictedDocuments, nil
	}

	documents, docErr := storage.PlanDocumentsReadByModelPlanID(store, logger, id, s3Client)

	if docErr != nil {
		return nil, docErr
	}
	return documents, nil

}

// PlanDocumentsReadByPlanTaskID implements resolver logic to fetch plan documents attributed to a plan task.
func PlanDocumentsReadByPlanTaskID(logger *zap.Logger, task *models.PlanTask, principal authentication.Principal, store *storage.Store, s3Client *s3.S3Client) ([]*models.PlanDocument, error) {
	isCollaborator, err := accesscontrol.IsCollaboratorModelPlanID(logger, principal, store, task.ModelPlanID)
	if err != nil {
		return nil, err
	}

	if !isCollaborator || principal.AllowNonCMSUser() {
		notRestrictedDocuments, err := storage.PlanDocumentsReadByPlanTaskIDNotRestricted(store, logger, task.ID, s3Client)
		if err != nil {
			return nil, err
		}

		return notRestrictedDocuments, nil
	}

	documents, docErr := storage.PlanDocumentsReadByPlanTaskID(store, logger, task.ID, s3Client)
	if docErr != nil {
		return nil, docErr
	}

	return documents, nil
}

// PlanDocumentDelete implements resolver logic to update a plan document object
func PlanDocumentDelete(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*int, error) {
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*int, error) {
		existingdoc, err := storage.PlanDocumentGetByIDNoS3Check(tx, logger, id)
		if err != nil {
			return nil, err
		}
		err = BaseStructPreDelete(logger, existingdoc, principal, tx, true)
		if err != nil {
			return nil, err
		}

		sqlResult, err := storage.PlanDocumentDelete(tx, logger, id, principal.Account().ID)
		if err != nil {
			return nil, err
		}

		rowsAffected, err := sqlResult.RowsAffected()
		return new(int(rowsAffected)), err
	})

}
