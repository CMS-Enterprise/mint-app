// Package humanizedaudit translates audit delta slices to human readable changes
package humanizedaudit

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/mappings"
	"github.com/cmsgov/mint-app/pkg/constants"
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

	plan, err := store.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	audits, err := storage.AuditChangeCollectionGetByModelPlanIDandTimeRange(store, logger, plan.ID, timeStart, timeEnd)
	if err != nil {
		return nil, err
	}
	humanizedChanges, err := humanizeChangeSet(ctx, store, plan, audits)
	if err != nil {
		return nil, fmt.Errorf("issue analyzing model plan change set for time start %s to time end %s. Error : %w", timeStart, timeEnd, err)
	}

	//Ticket: (ChChCh Changes!) save to the database by calling a store method here.
	retHumanizedChanges, err := storage.HumanizedAuditChangeCreateCollection(store, humanizedChanges)

	return retHumanizedChanges, err

}

// humanizeChangeSet trans
func humanizeChangeSet(
	ctx context.Context,
	store *storage.Store,
	plan *models.ModelPlan,
	audits []*models.AuditChange,
) ([]*models.HumanizedAuditChange, error) {
	// Ticket: (ChChCh Changes!) We are
	planChanges, err := humanizeModelPlanAudits(ctx, store, plan, audits)
	if err != nil {
		return nil, err
	}

	partsAndProviderChanges, err := humanizeParticipantsAndProviders(ctx, store, plan, audits)
	if err != nil {
		return nil, err
	}

	combinedChanges := append(planChanges, partsAndProviderChanges...)

	return combinedChanges, nil

}

func humanizeModelPlanAudits(ctx context.Context, store *storage.Store, plan *models.ModelPlan, audits []*models.AuditChange) ([]*models.HumanizedAuditChange, error) {
	// model PL
	changes := []*models.HumanizedAuditChange{}

	modelPlanAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "model_plan"
	})
	for _, modelAudit := range modelPlanAudits {

		for fieldName, field := range modelAudit.Fields { //fieldName
			change := models.NewHumanizedAuditChange(
				constants.GetSystemAccountUUID(),
				*modelAudit.ModifiedBy,
				plan.ID,
				plan.ModelName,
				*modelAudit.ModifiedDts,
				modelAudit.TableName,
				modelAudit.TableID,
				modelAudit.ID,
				modelAudit.Action,
				fieldName,
				fieldName, //TODO: (ChChCh Changes!) Add Translation
				field.Old,
				field.Old, //TODO: (ChChCh Changes!) Add Translation
				field.New,
				field.New, //TODO: (ChChCh Changes!) Add Translation
			)
			change.MetaDataRaw = field

			changes = append(changes, &change)

		}

	}

	return changes, nil
}

func humanizeParticipantsAndProviders(ctx context.Context, store *storage.Store, plan *models.ModelPlan, audits []*models.AuditChange) ([]*models.HumanizedAuditChange, error) {
	// model PL
	changes := []*models.HumanizedAuditChange{}

	modelPlanAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_participants_and_providers"
	})
	translation, err := mappings.ParticipantsAndProvidersTranslation()
	if err != nil {
		return nil, fmt.Errorf("unable to get translation for Participants and Providers, err : %w", err)
	}
	// translationMap, err := models.StructToMap(translation)
	translationMap, err := models.StructToMapDBTag(*translation) //TODO (ChChCh Changes!) Maybe make this return the map from the library?
	if err != nil {
		return nil, fmt.Errorf("unable to convert translation for Participants and Providers to a map, err : %w", err)
	}
	type partsAndProviderTranslatedField struct { // Ticket: (ChChCh Changes!) This should be expanded and moved. We might need a specific type here either...
		Question string
		Old      interface{}
		New      interface{}
	}
	for _, modelAudit := range modelPlanAudits {

		for fieldName, field := range modelAudit.Fields {
			fieldInterface := translationMap[fieldName]
			fieldTrans, ok := fieldInterface.(mappings.TranslationFieldProperties)
			if !ok {
				continue
				// Ticket: (ChChCh Changes!) Verify this, there are other field types. We should have helper methods
			}
			translatedField := partsAndProviderTranslatedField{
				Question: fieldTrans.Label,
				Old:      field.Old,
				New:      field.New,
			}
			change := models.NewHumanizedAuditChange(
				constants.GetSystemAccountUUID(),
				*modelAudit.ModifiedBy,
				plan.ID,
				plan.ModelName,
				*modelAudit.ModifiedDts,
				modelAudit.TableName,
				modelAudit.TableID,
				modelAudit.ID,
				modelAudit.Action,
				fieldName,
				fieldTrans.Label, //TODO: (ChChCh Changes!) We should also see about the Read Only Label, it is in context of not answering the question which makes sense here
				field.Old,
				field.Old, //TODO: (ChChCh Changes!) Add Translation
				field.New,
				field.New, //TODO: (ChChCh Changes!) Add Translation
			)
			change.MetaDataRaw = translatedField //Ticket: (ChChCh Changes!) This should actually translate the data

			fmt.Println(fieldName)
			changes = append(changes, &change)

		}

	}

	return changes, nil
}
