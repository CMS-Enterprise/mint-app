package storage

import (
	"context"
	"fmt"

	"github.com/lib/pq"
	"golang.org/x/sync/errgroup"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestDocumentCreate creates a CTAT request document row.
func CTATRequestDocumentCreate(
	np sqlutils.NamedPreparer,
	doc *models.CTATRequestDocument,
) (*models.CTATRequestDocument, error) {
	if doc.ID == uuid.Nil {
		doc.ID = uuid.New()
	}

	doc.ModifiedBy = nil
	doc.ModifiedDts = nil

	createdDoc, procErr := sqlutils.GetProcedure[models.CTATRequestDocument](np, sqlqueries.CTATRequestDocument.Create, doc)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating CTAT request document: %w", procErr)
	}

	return createdDoc, nil
}

// CTATRequestDocumentGetByCTATRequestIDLOADER returns CTAT request documents for the supplied CTAT request IDs.
func CTATRequestDocumentGetByCTATRequestIDLOADER(np sqlutils.NamedPreparer, ctatRequestIDs []uuid.UUID) ([]*models.CTATRequestDocument, error) {
	args := map[string]any{
		"ctat_request_ids": pq.Array(ctatRequestIDs),
	}

	return sqlutils.SelectProcedure[models.CTATRequestDocument](np, sqlqueries.CTATRequestDocument.GetByCTATRequestID, args)
}

// CTATRequestDocumentsUpdateVirusScanStatuses updates virus scan fields from S3 av-status tags.
func CTATRequestDocumentsUpdateVirusScanStatuses(ctx context.Context, s3Client *s3.S3Client, documents []*models.CTATRequestDocument) error {
	errorGroup, groupCtx := errgroup.WithContext(ctx)
	for documentIndex := range documents {
		document := documents[documentIndex]
		errorGroup.Go(func() error {
			return ctatRequestDocumentUpdateVirusScanStatus(groupCtx, s3Client, document)
		})
	}

	return errorGroup.Wait()
}

func ctatRequestDocumentUpdateVirusScanStatus(ctx context.Context, s3Client *s3.S3Client, document *models.CTATRequestDocument) error {
	if document.URL != nil && *document.URL != "" {
		document.VirusScanned = true
		document.VirusClean = true
		return nil
	}

	status, err := s3Client.TagValueForKey(ctx, document.FileKey, "av-status")
	if err != nil {
		return err
	}

	switch status {
	case "CLEAN":
		document.VirusScanned = true
		document.VirusClean = true
	case "INFECTED":
		document.VirusScanned = true
		document.VirusClean = false
	default:
		document.VirusScanned = false
		document.VirusClean = false
	}

	return nil
}
