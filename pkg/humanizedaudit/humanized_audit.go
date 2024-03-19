// Package humanizedaudit translates audit delta slices to human readable changes
package humanizedaudit

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// HumanizeAuditsForModelPlan gets all changes for a model plan and related sections in a time period,
// It groups the changes by actor, and a debounced time period. It will then save this record to the database
func HumanizeAuditsForModelPlan(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	timeStart time.Time,
	timeEnd time.Time,
	modelPlanID uuid.UUID) ([]*models.HumanizedAuditChange, error) {
	dayToAnalyze := time.Now()

	mp, err := store.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	//Ticket: (ChChCh Changes!) Perhaps we need to expand this This only works for the child level of a relationship (eg to task list or document)
	//This doesn't work when you are looking at an operational solution or operational solutions subtask
	audits, err := store.AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate(logger, mp.ID, mp.ID, dayToAnalyze, models.SortDesc)
	if err != nil {
		return nil, err
	}
	humanizedChanges, err := humanizeChangeSet(audits, store)

	//Ticket: (ChChCh Changes!) save to the database by calling a store method here.
	retHumanizedChanges, err := humanizedChanges, err

	return retHumanizedChanges, err

}

// humanizeChangeSet trans
func humanizeChangeSet(audits []*models.AuditChange, store *storage.Store) ([]*models.HumanizedAuditChange, error) {
	planChanges, err := humanizeModelPlanAudits(audits, store)
	if err != nil {
		return nil, err
	}

	partsAndProviderChanges, err := humanizeParticipantsAndProviders(audits, store)
	if err != nil {
		return nil, err
	}

	combinedChanges := append(planChanges, partsAndProviderChanges...)

	return combinedChanges, nil

}

func humanizeModelPlanAudits(audits []*models.AuditChange, store *storage.Store) ([]*models.HumanizedAuditChange, error) {
	// model PL
	changes := []*models.HumanizedAuditChange{}

	modelPlanAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "model_plan"
	})
	for _, modelAudit := range modelPlanAudits {

		for fieldName, field := range modelAudit.Fields {

			change := models.HumanizedAuditChange{
				Date:        *modelAudit.ModifiedDts, //Potential nil pointer...
				MetaDataRaw: field,                   //Ticket: (ChChCh Changes!) This should actually translate the data
			}
			fmt.Println(fieldName)
			changes = append(changes, &change)

		}

	}

	return changes, nil
}

func humanizeParticipantsAndProviders(audits []*models.AuditChange, store *storage.Store) ([]*models.HumanizedAuditChange, error) {
	// model PL
	changes := []*models.HumanizedAuditChange{}

	modelPlanAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_participants_and_providers"
	})
	for _, modelAudit := range modelPlanAudits {

		for fieldName, field := range modelAudit.Fields {

			change := models.HumanizedAuditChange{
				Date:        *modelAudit.ModifiedDts, //Potential nil pointer...
				MetaDataRaw: field,                   //Ticket: (ChChCh Changes!) This should actually translate the data
			}
			fmt.Println(fieldName)
			changes = append(changes, &change)

		}

	}

	return changes, nil
}
