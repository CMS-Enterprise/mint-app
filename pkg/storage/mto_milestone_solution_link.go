package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOMilestoneSolutionLinkCreate creates a new MTO Milestone-Solution link in the database
func MTOMilestoneSolutionLinkCreate(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	mtoMilestoneSolutionLink *models.MTOMilestoneSolutionLink,
) (*models.MTOMilestoneSolutionLink, error) {

	if mtoMilestoneSolutionLink.ID == uuid.Nil {
		mtoMilestoneSolutionLink.ID = uuid.New()
	}

	link, procErr := sqlutils.GetProcedure[models.MTOMilestoneSolutionLink](
		np,
		sqlqueries.MTOMilestoneSolutionLink.Create,
		mtoMilestoneSolutionLink,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTO Milestone-Solution link: %w", procErr)
	}

	return link, nil
}

// MTOMilestoneSolutionLinkGetByMilestoneID returns all MTO Milestone-Solution links for a given Milestone ID
func MTOMilestoneSolutionLinkGetByMilestoneID(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	milestoneID uuid.UUID,
) ([]*models.MTOMilestoneSolutionLink, error) {

	arg := map[string]interface{}{"milestone_id": milestoneID}

	returned, procErr := sqlutils.SelectProcedure[models.MTOMilestoneSolutionLink](
		np,
		sqlqueries.MTOMilestoneSolutionLink.GetByMilestoneID,
		arg,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue retrieving MTO Milestone-Solution links: %w", procErr)
	}

	return returned, nil
}

// MTOMilestoneSolutionLinkMergeSolutionsToMilestones takes a list of solution ids, and will merge them to a milestone
// the end result is that solutions not included here have their link removed
func MTOMilestoneSolutionLinkMergeSolutionsToMilestones(
	tx *sqlx.Tx,
	_ *zap.Logger,
	milestoneID uuid.UUID,
	solutionIDs []uuid.UUID,
	actorID uuid.UUID,
) ([]*models.MTOSolution, error) {

	// Since the link can be deleted, set the current session user variable for audit purposes
	err := setCurrentSessionUserVariable(tx, actorID)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"milestone_id": milestoneID,
		"solution_ids": pq.Array(solutionIDs),
		"created_by":   actorID,
	}

	returned, procErr := sqlutils.SelectProcedure[models.MTOSolution](
		tx,
		sqlqueries.MTOMilestoneSolutionLink.MergeSolutionsToMilestones,
		arg,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue merging MTO Milestone-Solution links: %w", procErr)
	}

	return returned, nil
}

// MTOMilestoneSolutionLinkMilestonesToSolution takes a list of milestone IDs and links them to a solution.
// The end result is that milestones not included here are unlinked from the solution.
func MTOMilestoneSolutionLinkMilestonesToSolution(
	tx *sqlx.Tx,
	logger *zap.Logger,
	solutionID uuid.UUID,
	milestoneIDs []uuid.UUID,
	actorID uuid.UUID,
) ([]*models.MTOMilestone, error) {
	// Set the current session user variable for audit purposes
	err := setCurrentSessionUserVariable(tx, actorID)
	if err != nil {
		return nil, fmt.Errorf("failed to set session user variable: %w", err)
	}

	// Prepare query arguments
	arg := map[string]interface{}{
		"solution_id":   solutionID,
		"milestone_ids": pq.Array(milestoneIDs),
		"created_by":    actorID,
	}

	// Execute the SQL query and return the linked milestones
	returned, procErr := sqlutils.SelectProcedure[models.MTOMilestone](
		tx,
		sqlqueries.MTOMilestoneSolutionLink.LinkMilestonesToSolution,
		arg,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue linking milestones to solution: %w", procErr)
	}

	return returned, nil
}
