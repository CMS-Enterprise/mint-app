package storage

import (
	"time"

	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

type ctatRequestLiteRow struct {
	ID                    uuid.UUID                                   `db:"id"`
	Requester             uuid.UUID                                   `db:"requester"`
	HumanReadableIDNumber int                                         `db:"human_readable_id_number"`
	SubmissionDate        time.Time                                   `db:"submission_date"`
	ContractName          *string                                     `db:"contract_name"`
	TypeOfHelpNeeded      models.EnumArray[models.CTATHelpNeededType] `db:"type_of_help_needed"`
	TypeOfHelpNeededOther *string                                     `db:"type_of_help_needed_other"`
	Status                *models.CTATStatus                          `db:"status"`
}

func (row *ctatRequestLiteRow) toModel() *models.CTATRequestLite {
	if row == nil {
		return nil
	}

	return &models.CTATRequestLite{
		ID:                    row.ID,
		Requester:             row.Requester,
		HumanReadableIDNumber: row.HumanReadableIDNumber,
		SubmissionDate:        row.SubmissionDate,
		ContractName:          row.ContractName,
		TypeOfHelpNeeded:      []models.CTATHelpNeededType(row.TypeOfHelpNeeded),
		TypeOfHelpNeededOther: row.TypeOfHelpNeededOther,
		Status:                row.Status,
	}
}

// CTATRequestLiteGetByRequesterIDLOADER returns the lite CTAT requests for the supplied requester IDs.
func CTATRequestLiteGetByRequesterIDLOADER(np sqlutils.NamedPreparer, requesterIDs []uuid.UUID) ([]*models.CTATRequestLite, error) {
	args := map[string]any{
		"requester_ids": pq.Array(requesterIDs),
	}

	rows, err := sqlutils.SelectProcedure[ctatRequestLiteRow](np, sqlqueries.CTATRequest.GetByRequesterID, args)
	if err != nil {
		return nil, err
	}

	requestLiteCollection := make([]*models.CTATRequestLite, len(rows))
	for i, row := range rows {
		requestLiteCollection[i] = row.toModel()
	}

	return requestLiteCollection, nil
}

// CTATRequestLiteCollectionGetForAdmin returns the lite CTAT requests for the admin table view.
func CTATRequestLiteCollectionGetForAdmin(np sqlutils.NamedPreparer) ([]*models.CTATRequestLite, error) {
	rows, err := sqlutils.SelectProcedure[ctatRequestLiteRow](np, sqlqueries.CTATRequest.GetForAdmin, map[string]any{})
	if err != nil {
		return nil, err
	}

	requestLiteCollection := make([]*models.CTATRequestLite, len(rows))
	for i, row := range rows {
		requestLiteCollection[i] = row.toModel()
	}

	return requestLiteCollection, nil
}
